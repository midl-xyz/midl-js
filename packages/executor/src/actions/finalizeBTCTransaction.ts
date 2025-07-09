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
import type { Client, StateOverride } from "viem";
import { estimateGasMulti } from "viem/actions";
import type { StoreApi } from "zustand";
import { getPublicKeyForAccount } from "~/actions/getPublicKeyForAccount";
import { multisigAddress } from "~/config";
import {
	calculateTransactionsCost,
	convertETHtoBTC,
	getEVMAddress,
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
	 * Fee rate multiplier for the transaction
	 */
	feeRateMultiplier?: number;

	/**
	 * Number of assets to withdraw
	 */
	assetsToWithdrawSize?: number;

	/**
	 * If true skips estimate gas for EVM transactions
	 */
	skipEstimateGasMulti?: boolean;

	multisigAddress?: string;
};

/**
 * Prepares BTC transaction for the intentions.
 * Calculates gas limits for EVM transactions, total fees and transfers.
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
	options: FinalizeBTCTransactionOptions = {},
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	const { intentions = [] } = store.getState();

	if (intentions.length === 0) {
		throw new Error("Cannot finalize BTC transaction without intentions");
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
				// Increase gas limit by 20% to account for potential fluctuations
				Math.ceil(Number(gasLimits[i]) * 1.2),
			);
		}
	}

	const hasWithdraw = intentions.some((it) => it.hasWithdraw);
	const hasRunesWithdraw = intentions.some((it) => it.hasRunesWithdraw);

	const totalCost = await calculateTransactionsCost(
		[...evmTransactions],
		config,
		{
			feeRateMultiplier: options.feeRateMultiplier,
			gasPrice: options.gasPrice,
			hasDeposit: intentions.some((it) => it.hasDeposit),
			hasWithdraw: hasWithdraw,
			hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
			hasRunesWithdraw: hasRunesWithdraw,
			assetsToWithdrawSize: options.assetsToWithdrawSize ?? 0,
		},
	);

	const btcTransfer = convertETHtoBTC(
		intentions.reduce((acc, it) => {
			return acc + (it.evmTransaction?.value ?? 0n);
		}, 0n),
	);

	const transfers: EdictRuneParams["transfers"] = [
		{
			receiver: options.multisigAddress ?? multisigAddress[network.id],
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
			receiver: options.multisigAddress ?? multisigAddress[network.id],
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

	return btcTx;
};
