import {
	type Config,
	type EdictRuneParams,
	type EdictRuneResponse,
	type TransferBTCParams,
	type TransferBTCResponse,
	edictRune,
	ensureMoreThanDust,
	getDefaultAccount,
	transferBTC,
} from "@midl/core";
import type { Client, StateOverride } from "viem";
import { estimateBTCTransaction } from "~/actions/estimateBTCTransaction";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { LoggerNamespace, getLogger, multisigAddress } from "~/config";
import type { TransactionIntention } from "~/types";
import { aggregateIntentionRunes } from "~/utils";

const logger = getLogger([LoggerNamespace.Actions, "finalizeBTCTransaction"]);

type FinalizeBTCTransactionOptions = {
	/**
	 * State override for EVM transactions
	 */
	stateOverride?: StateOverride;
	/**
	 * BTC address used to sign the transactions
	 */
	from?: string;

	/**
	 * Custom fee rate
	 */
	feeRate?: number;

	/**
	 * If true skips estimate gas for EVM transactions
	 */
	skipEstimateGas?: boolean;

	/**
	 * Multisig address to use for the transaction.
	 * If not provided, the default multisig address for the current network will be used.
	 */
	multisigAddress?: string;

	/**
	 * Gas multiplier to apply to the estimated gas limit (default: 1.2).
	 * Used to ensure the transaction has enough gas to be processed and avoid potential gas fluctuations.
	 */
	gasMultiplier?: number;
};

/**
 * Prepares a Bitcoin transaction for the provided intentions.
 *
 * Calculates gas limits for EVM transactions, total fees, and transfers. Handles both BTC and rune transfers.
 *
 * @param config - The configuration object.
 * @param intentions - Array of TransactionIntention objects to process.
 * @param client - EVM client or provider (viem).
 * @param options - Optional configuration options.
 *
 * @returns A BTC transaction response: EdictRuneResponse or TransferBTCResponse.
 *
 * @throws If no network is set, no account is found, intentions are empty, or more than 10 intentions/runes.
 *
 * @example
 * const btcTx = await finalizeBTCTransaction(config, intentions, client, { feeRate: 10 });
 */
export const finalizeBTCTransaction = async (
	config: Config,
	intentions: TransactionIntention[],
	client: Client,
	{
		feeRate: customFeeRate,
		gasMultiplier,
		...options
	}: FinalizeBTCTransactionOptions = {},
) => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	if (intentions.length === 0) {
		throw new Error("Cannot finalize BTC transaction without intentions");
	}

	if (intentions.length > 10) {
		throw new Error(
			"Cannot finalize BTC transaction with more than 10 intentions",
		);
	}

	const account = getDefaultAccount(
		config,
		options.from ? (it) => it.address === options.from : undefined,
	);

	if (!account) {
		throw new Error("No account found for public key");
	}

	const runesToDeposit = aggregateIntentionRunes(intentions, "deposit");
	const runesToWithdraw = aggregateIntentionRunes(intentions, "withdraw");

	const hasWithdraw = intentions.some((it) => Boolean(it.withdraw));
	const hasRunesWithdraw = runesToWithdraw.length > 0;
	const hasRunesDeposit = runesToDeposit.length > 0;

	const feeRate = customFeeRate ?? Number(await getBTCFeeRate(config, client));

	logger.debug(
		"Finalizing BTC transaction with fee rate: {feeRate}, hasWithdraw: {hasWithdraw}, hasRunesWithdraw: {hasRunesWithdraw}, hasRunesDeposit: {hasRunesDeposit}, runesToDeposit: {runesToDeposit}, runesToWithdraw: {runesToWithdraw}",
		{
			feeRate,
			hasWithdraw,
			hasRunesWithdraw,
			hasRunesDeposit,
			runesToDeposit,
			runesToWithdraw,
		},
	);

	const { intentions: estimatedIntentions, fee: btcFee } =
		await estimateBTCTransaction(config, intentions, client, {
			feeRate,
			stateOverride: options.stateOverride,
			from: options.from,
			multisigAddress: options.multisigAddress,
			gasMultiplier,
		});

	/**
	 * Warning: we mutate the intentions here to add the estimated gas fees.
	 * This is done to avoid having to return a new array of intentions.
	 */
	for (const [i, intention] of intentions.entries()) {
		if (intention.evmTransaction) {
			intention.evmTransaction.gas = estimatedIntentions[i].evmTransaction?.gas;
		}
	}

	const btcTransfer = intentions.reduce((acc, it) => {
		return acc + (it?.deposit?.satoshis ?? 0);
	}, 0);

	const transfers: EdictRuneParams["transfers"] = [
		{
			receiver: options.multisigAddress ?? multisigAddress[network.id],
			amount: ensureMoreThanDust(Math.ceil(Number(btcFee) + btcTransfer)),
		},
	];

	for (const rune of runesToDeposit) {
		transfers.push({
			receiver: options.multisigAddress ?? multisigAddress[network.id],
			amount: rune.value,
			runeId: rune.id,
		});
	}

	logger.debug(
		"Preparing BTC transaction with transfers: {transfers}, feeRate: {feeRate}",
		{
			transfers,
			feeRate,
		},
	);

	let btcTx: EdictRuneResponse | TransferBTCResponse;

	if (runesToDeposit.length > 0) {
		btcTx = await edictRune(config, {
			transfers,
			publish: false,
			feeRate,
		});
	} else {
		btcTx = await transferBTC(config, {
			transfers: transfers as TransferBTCParams["transfers"],
			publish: false,
			feeRate,
		});
	}

	return btcTx;
};
