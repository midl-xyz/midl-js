import { type Config, getDefaultAccount } from "@midl/core";
import { getLogger } from "@midl/logger";
import type { Client, StateOverride } from "viem";
import { estimateGasMulti } from "viem/actions";
import { createStateOverride } from "~/actions/createStateOverride";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { LoggerNamespace } from "~/config";
import type { TransactionIntention, TransactionIntentionEVM } from "~/types";
import {
	aggregateIntentionRunes,
	calculateTransactionsCost,
	getEVMAddress,
	satoshisToWei,
} from "~/utils";

const logger = getLogger([LoggerNamespace.Actions, "estimateBTCTransaction"]);

export type EstimateBTCTransactionOptions = {
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

export type EstimateBTCTransactionResponse = {
	/**
	 * Intentions with estimated gas limits for EVM transactions
	 */
	intentions: TransactionIntention[];
	/**
	 * Estimated fee in satoshis
	 */
	fee: number;
};

/**
 * Estimates the cost and gas requirements for a Bitcoin transaction with the provided intentions.
 * Calculates gas limits for EVM transactions and total fees without executing the transaction.
 */
export const estimateBTCTransaction = async (
	config: Config,
	intentions: TransactionIntention[],
	client: Client,
	{
		feeRate: customFeeRate,
		gasMultiplier = 1.2,
		...options
	}: EstimateBTCTransactionOptions = {},
): Promise<EstimateBTCTransactionResponse> => {
	const { network } = config.getState();

	if (!network) {
		throw new Error("No network set");
	}

	if (intentions.length === 0) {
		throw new Error("No intentions found");
	}

	if (intentions.length > 10) {
		throw new Error(
			"Cannot estimate BTC transaction with more than 10 intentions",
		);
	}

	const account = getDefaultAccount(
		config,
		options.from ? (it) => it.address === options.from : undefined,
	);

	if (!account) {
		throw new Error("No account found");
	}

	const evmAddress = getEVMAddress(account, network);
	const clonedIntentions = structuredClone(intentions);
	const evmIntentions = clonedIntentions.filter(
		(it): it is TransactionIntentionEVM => Boolean(it.evmTransaction),
	);

	const evmTransactions = evmIntentions.map((it) => it.evmTransaction);
	const runesToDeposit = aggregateIntentionRunes(intentions, "deposit");
	const runesToWithdraw = aggregateIntentionRunes(intentions, "withdraw");

	const hasWithdraw = intentions.some((it) => Boolean(it.withdraw));
	const hasRunesWithdraw = runesToWithdraw.length > 0;
	const hasRunesDeposit = runesToDeposit.length > 0;
	const feeRate = customFeeRate ?? Number(await getBTCFeeRate(config, client));

	logger.debug(
		"Estimating BTC transaction with fee rate: {feeRate}, hasWithdraw: {hasWithdraw}, hasRunesWithdraw: {hasRunesWithdraw}, hasRunesDeposit: {hasRunesDeposit}, runesToDeposit: {runesToDeposit}, runesToWithdraw: {runesToWithdraw}",
		{
			feeRate,
			hasWithdraw,
			hasRunesWithdraw,
			hasRunesDeposit,
			runesToDeposit,
			runesToWithdraw,
		},
	);

	const stateOverride =
		options.stateOverride ??
		(await createStateOverride(config, client, intentions));

	const emvTransactionsWithoutGas = evmTransactions.filter(
		(it) => it.gas === undefined,
	);

	let gasLimits: bigint[] = [];

	if (emvTransactionsWithoutGas.length > 0) {
		logger.debug(
			"Estimating gas for EVM transactions: {evmTransactions}, stateOverride: {stateOverride}, evmAddress: {evmAddress}",
			{
				evmTransactions,
				stateOverride,
				evmAddress,
			},
		);

		gasLimits = await estimateGasMulti(client as Client, {
			transactions: evmTransactions,
			stateOverride,
			account: evmAddress,
		});

		for (const [i, tx] of evmTransactions.entries()) {
			if (tx.gas !== undefined) {
				continue;
			}

			tx.gas = BigInt(Math.ceil(Number(gasLimits[i]) * gasMultiplier));
		}

		logger.trace("Estimated gas limits for EVM transactions: {gasLimits}", {
			gasLimits,
		});
	}

	const totalGas = evmTransactions.reduce(
		(acc, tx) => acc + (tx.gas ?? 0n),
		0n,
	);

	const totalCost = calculateTransactionsCost(totalGas, {
		feeRate,
		hasWithdraw,
		hasRunesDeposit,
		hasRunesWithdraw,
		assetsToWithdrawSize: runesToWithdraw.length,
	});

	logger.debug("Total gas: {totalGas}, totalCost: {totalCost}", {
		totalGas,
		totalCost,
	});

	/**
	 * If stateOverride is not provided, create one with minimum fees to ensure transactions pass
	 */
	if (!options.stateOverride) {
		const stateOverrideWithMinFees =
			options.stateOverride ??
			(await createStateOverride(
				config,
				client,
				intentions,
				satoshisToWei(totalCost),
			));

		logger.debug(
			"Creating state override with minimum fees: {stateOverrideWithMinFees}",
			{
				stateOverrideWithMinFees,
			},
		);

		await estimateGasMulti(client as Client, {
			transactions: evmTransactions,
			stateOverride: stateOverrideWithMinFees,
			account: evmAddress,
		});
	}

	logger.debug("Final EVM transactions with gas limits: {evmTransactions}", {
		evmTransactions,
	});

	return {
		fee: totalCost,
		intentions: clonedIntentions,
	};
};
