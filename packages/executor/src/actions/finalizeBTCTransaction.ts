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
import {
	type Address,
	type Client,
	type StateOverride,
	encodeFunctionData,
	padHex,
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
} from "~/utils";

type FinalizeBTCTransactionOptions = {
	/**
	 * State override for EVM transactions
	 */
	stateOverride?: StateOverride;
	/**
	 * Public key of the account to use for signing
	 */
	publicKey?: string;
	/**
	 * Gas price for EVM transactions
	 */
	gasPrice?: bigint;
	/**
	 * If true, send complete transaction
	 */
	shouldComplete?: boolean;

	/**
	 * Fee rate multiplier for the transaction
	 */
	feeRateMultiplier?: number;

	/**
	 * Array of ERC20 assets to withdraw
	 */
	assetsToWithdraw?: [Address] | [Address, Address];

	/**
	 * If true skips estimate gas for EVM transactions
	 */
	skipEstimateGasMulti?: boolean;
};

/**
 * Prepares BTC transaction for the intentions.
 * Calculates gas limits for EVM transactions, total fees and transfers.
 *
 * If `options.shouldComplete` is true, adds a complete transaction to the intentions.
 *
 * @param config The configuration object
 * @param store The store object
 * @param client EVM client or provider (viem)
 * @param options Configuration options
 * @returns BTC transaction response
 */
export const finalizeBTCTransaction = async (
	config: Config,
	store: StoreApi<MidlContextState>,
	client: Client,
	options: FinalizeBTCTransactionOptions,
) => {
	const { network } = config.getState();

	if (!network) {
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

	if (!options.skipEstimateGasMulti) {
		let gasLimits: bigint[];

		gasLimits = await estimateGasMulti(client as Client, {
			transactions: evmTransactions,
			stateOverride: options.stateOverride,
			account: evmAddress,
		});

		for (const [i, intention] of evmIntentions.entries()) {
			intention.evmTransaction.gas = BigInt(
				Math.ceil(Number(gasLimits[i]) * 1.2),
			);
		}
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
			receiver: multisigAddress[network.id],
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
			receiver: multisigAddress[network.id],
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
				to: executorAddress[network.id] as Address,
				gas: 300_000n,
				data: encodeFunctionData({
					abi: executorAbi,
					functionName: "completeTx",
					args: [
						`0x${btcTx.tx.id}`,
						pk as `0x${string}`,
						padHex("0x0", { size: 32 }), // BTC receiver
						options.assetsToWithdraw ?? [],
						new Array(options.assetsToWithdraw?.length ?? 0).fill(0n),
					],
				}),
				chainId: getEVMFromBitcoinNetwork(network).id,
			},
		});
	}

	return btcTx;
};
