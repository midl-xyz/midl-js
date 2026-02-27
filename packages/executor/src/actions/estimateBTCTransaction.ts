import { type Config, getDefaultAccount } from "@midl/core";
import { getLogger } from "@midl/logger";
import {
	type Client,
	encodeFunctionData,
	type PublicClient,
	type StateOverride,
	toHex,
	zeroAddress,
} from "viem";
import { estimateGasMulti, getBalance, readContract } from "viem/actions";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { LoggerNamespace, SystemContracts } from "~/config";
import { executorAbi } from "~/contracts";
import type { TransactionIntention, TransactionIntentionEVM } from "~/types";
import {
	aggregateIntentionRunes,
	calculateTransactionsCost,
	getEVMAddress,
	runeIdToBytes32,
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

	/**
	 * If true skips estimate gas for EVM transactions
	 */
	skipEstimateGas?: boolean;
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

const ONE_BITCOIN = 10 ** 8;

/**
 * Estimates the cost and gas requirements for a Bitcoin transaction with the provided intentions.
 * Calculates gas limits for EVM transactions and total fees without executing the transaction.
 */
export const estimateBTCTransaction = async (
	config: Config,
	intentions: TransactionIntention[],
	client: PublicClient,
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
	const feeRate = customFeeRate ?? Number(await getBTCFeeRate(client));
	const btcDeposit = intentions.reduce((acc, intention) => {
		return acc + (intention.deposit?.satoshis || 0);
	}, 0);

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

	const emvTransactionsWithoutGas = evmTransactions.filter(
		(it) => it.gas === undefined,
	);

	let gasLimits: bigint[] = [];

	if (emvTransactionsWithoutGas.length > 0 && !options.skipEstimateGas) {
		logger.debug(
			"Estimating gas for EVM transactions: {evmTransactions}, evmAddress: {evmAddress}",
			{
				evmTransactions,
				evmAddress,
			},
		);

		// TODO: move to another function
		const [validatorAddress] = await readContract(client, {
			abi: [
				{
					type: "function",
					name: "currentValidators",
					stateMutability: "view",
					inputs: [],
					outputs: [
						{
							type: "address[]",
							internatType: "address[]",
							name: "",
						},
					],
				},
			],
			address: SystemContracts.ValidatorRegistry,
			functionName: "currentValidators",
		});

		const userBalance = await getBalance(client, {
			address: evmAddress,
		});

		gasLimits = await estimateGasMulti(client as Client, {
			transactions: [
				{
					to: SystemContracts.Executor,
					data: encodeFunctionData({
						abi: executorAbi,
						functionName: "acknowledgeTx",
						args: [
							{
								txHash: toHex(crypto.getRandomValues(new Uint8Array(32))),
								from: evmAddress,
								// We deposit an extra 1 BTC to cover fees for the estimate gas call only
								btcAmount: satoshisToWei(btcDeposit + ONE_BITCOIN),
								assets: runesToDeposit.map((rune) => runeIdToBytes32(rune.id)),
								amounts: runesToDeposit.map((rune) => rune.value),
								metadata: runesToDeposit.map(() =>
									toHex(crypto.getRandomValues(new Uint8Array(32))),
								),
								btcTx: toHex(crypto.getRandomValues(new Uint8Array(32))),
								synthAssets: runesToDeposit.map((rune) => {
									if (rune.isRequestAddAsset) {
										if (!rune.address) {
											throw new Error(
												"Rune address is required for requestAddAsset runes",
											);
										}

										return rune.address;
									}

									return zeroAddress;
								}),
							},
						],
					}),
					// @ts-expect-error Viem supports from field override but types are wrong
					from: validatorAddress,
				},
				...evmTransactions,
			],
			stateOverride: options.stateOverride ?? [
				{
					address: evmAddress,
					// We deposit an extra 1 BTC to cover fees for the estimate gas call only
					balance: satoshisToWei(btcDeposit + ONE_BITCOIN) + userBalance,
				},
			],
			account: evmAddress,
		});

		gasLimits.shift(); // Remove the first gas limit which is for acknowledgeTx

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

	logger.debug("Final EVM transactions with gas limits: {evmTransactions}", {
		evmTransactions,
	});

	return {
		fee: totalCost,
		intentions: clonedIntentions,
	};
};
