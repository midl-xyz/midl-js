import {
	type Config,
	type EdictRuneParams,
	type EdictRuneResponse,
	type TransferBTCParams,
	type TransferBTCResponse,
	edictRune,
	ensureMoreThanDust,
	transferBTC,
} from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import { JsonRpcProvider } from "ethers";
import {
	type Address,
	type Client,
	type StateOverride,
	encodeFunctionData,
} from "viem";
import { estimateGasMulti } from "viem/actions";
import type { StoreApi } from "zustand";
import { addTxIntention } from "~/actions/addTxIntention";
import { getPublicKeyForAccount } from "~/actions/getPublicKeyForAccount";
import { executorAddress, multisigAddress } from "~/config";
import { executorAbi } from "~/contracts/abi";
import {
	calculateTransactionsCost,
	convertETHtoBTC,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
	transformViemToEthersStateOverride,
	transformViemToEthersTx,
} from "~/utils";

type FinalizeBTCTransactionOptions = {
	stateOverride?: StateOverride;
	publicKey?: string;
	gasPrice?: bigint;
	/**
	 * If true, send complete transaction
	 */
	shouldComplete?: boolean;

	feeRateMultiplier?: number;

	assetsToWithdraw?: [Address] | [Address, Address];
};

export const finalizeBTCTransaction = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	client: Client | JsonRpcProvider,
	options: FinalizeBTCTransactionOptions,
) => {
	if (!config.network) {
		throw new Error("No network set");
	}

	const { intentions = [] } = store.getState();

	if (intentions.length === 0) {
		throw new Error("No intentions found");
	}

	const pk = await getPublicKeyForAccount(config, options.publicKey);
	const evmAddress = getEVMAddress(pk);
	const evmIntentions = intentions.filter((it) => Boolean(it.evmTransaction));
	const evmTransactions = evmIntentions.map((it) => it.evmTransaction);

	let gasLimits: bigint[];

	if (client instanceof JsonRpcProvider) {
		gasLimits = await client.estimateGasMulti(
			evmTransactions.map((it) => transformViemToEthersTx(it)),
			transformViemToEthersStateOverride(options.stateOverride),
		);
	} else {
		gasLimits = await estimateGasMulti(client, {
			transactions: evmTransactions,
			stateOverride: options.stateOverride,
			account: evmAddress,
		});
	}

	for (const [i, intention] of evmIntentions.entries()) {
		intention.evmTransaction.gas = BigInt(
			Math.ceil(Number(gasLimits[i]) * 1.2),
		);
	}

	const hasWithdraw =
		intentions.some((it) => it.hasWithdraw) || options.shouldComplete;
	const hasRunesWithdraw =
		intentions.some((it) => it.hasRunesWithdraw) ||
		(options.shouldComplete && (options.assetsToWithdraw?.length ?? 0) > 0);

	const totalCost = await calculateTransactionsCost(
		[
			...evmTransactions,
			...(options.shouldComplete
				? [
						{
							gas: 300_000n,
						},
					]
				: []),
		],
		config,
		{
			feeRateMultiplier: options.feeRateMultiplier,
			gasPrice: options.gasPrice,
			hasDeposit: intentions.some((it) => it.hasDeposit),
			hasWithdraw: hasWithdraw,
			hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
			hasRunesWithdraw: hasRunesWithdraw,
			assetsToWithdrawSize: options.assetsToWithdraw?.length ?? 0,
		},
	);

	const btcTransfer = convertETHtoBTC(
		intentions.reduce((acc, it) => {
			return acc + (it.evmTransaction?.value ?? 0n);
		}, 0n),
	);

	const transfers: EdictRuneParams["transfers"] = [
		{
			receiver: multisigAddress[config.network.id],
			amount: ensureMoreThanDust(Math.ceil(Number(totalCost) + btcTransfer)),
		},
	];

	const runes = Array.from(
		intentions
			.filter((it) => it.hasRunesDeposit)
			.map((it) => {
				if (!it.rune) {
					throw new Error("No rune set");
				}

				return it.rune;
			})
			.reduce(
				(acc, rune) => {
					acc.set(rune.id, {
						id: rune.id,
						value: acc.get(rune.id)
							? // biome-ignore lint/style/noNonNullAssertion: <explanation>
								acc.get(rune.id)!.value + rune.value
							: rune.value,
					});

					return acc;
				},
				new Map<
					string,
					{
						id: string;
						value: bigint;
					}
				>(),
			)
			.values(),
	);

	if (runes.length > 2) {
		throw new Error("Transferring more than two runes is not allowed");
	}

	for (const rune of runes) {
		transfers.push({
			receiver: multisigAddress[config.network.id],
			amount: rune.value,
			runeId: rune.id,
		});
	}

	let btcTx: EdictRuneResponse | TransferBTCResponse;

	if (runes.length > 0) {
		btcTx = await edictRune(config, {
			transfers,
			publish: false,
		});
	} else {
		btcTx = await transferBTC(config, {
			transfers: transfers as TransferBTCParams["transfers"],
			publish: false,
		});
	}

	if (options.shouldComplete) {
		addTxIntention(config, store, {
			hasWithdraw,
			hasRunesWithdraw,

			evmTransaction: {
				to: executorAddress[config.network.id] as Address,
				gas: 300_000n,
				data: encodeFunctionData({
					abi: executorAbi,
					functionName: "completeTx",
					args: [
						`0x${btcTx.tx.id}`,
						pk as `0x${string}`,
						options.assetsToWithdraw ?? [],
						new Array(options.assetsToWithdraw?.length ?? 0).fill(0n),
					],
				}),
				chainId: getEVMFromBitcoinNetwork(config.network).id,
			},
		});
	}

	return btcTx;
};
