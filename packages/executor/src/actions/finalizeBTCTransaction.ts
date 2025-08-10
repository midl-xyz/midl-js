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
} from "@midl-xyz/midl-js-core";
import type { Client, StateOverride } from "viem";
import { estimateGasMulti } from "viem/actions";
import { createStateOverride } from "~/actions/createStateOverride";
import { getBTCFeeRate } from "~/actions/getBTCFeeRate";
import { multisigAddress } from "~/config";
import type { RunesTransfer, TransactionIntention, Withdrawal } from "~/types";
import { calculateTransactionsCost, getEVMAddress } from "~/utils";

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
	{ feeRate: customFeeRate, ...options }: FinalizeBTCTransactionOptions = {},
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

	const evmAddress = getEVMAddress(account, network);
	const evmIntentions = intentions.filter((it) => Boolean(it.evmTransaction));
	const evmTransactions = evmIntentions.map((it) => it.evmTransaction);
	const hasWithdraw = intentions.some(
		(it) =>
			typeof it.withdraw === "object" &&
			it.withdraw?.satoshis &&
			it.withdraw.satoshis > 0,
	);
	const hasRunesWithdraw = intentions.some(
		(it) =>
			typeof it.withdraw === "object" &&
			it.withdraw?.runes &&
			it.withdraw.runes.length > 0,
	);
	const hasRunesDeposit = intentions.some(
		(it) => it.deposit?.runes && it.deposit.runes.length > 0,
	);
	const feeRate = customFeeRate ?? Number(await getBTCFeeRate(config, client));

	const runes = Array.from(
		intentions
			.filter(
				(it) =>
					typeof it.withdraw === "object" &&
					it.withdraw?.runes &&
					it.withdraw.runes.length > 0,
			)
			.flatMap((it) => {
				// biome-ignore lint/suspicious/noExplicitAny: It was filtered above
				return (it.withdraw as any).runes as RunesTransfer[];
			})
			.reduce(
				(acc, rune) => {
					acc.set(rune.id, {
						id: rune.id,
						value: acc.get(rune.id)
							? // biome-ignore lint/style/noNonNullAssertion: <explanation>
								acc.get(rune.id)!.value + rune.amount
							: rune.amount,
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

	if (!options.skipEstimateGas) {
		const stateOverride =
			options.stateOverride ??
			(await createStateOverride(config, client, intentions));

		const emvTransactionsWithoutGas = evmTransactions.filter(
			(it) => it.gas === undefined,
		);

		let gasLimits: bigint[] = [];

		if (emvTransactionsWithoutGas.length > 0) {
			gasLimits = await estimateGasMulti(client as Client, {
				transactions: emvTransactionsWithoutGas,
				stateOverride,
				account: evmAddress,
			});

			for (const [i, tx] of emvTransactionsWithoutGas.entries()) {
				if (tx.gas !== undefined) {
					continue;
				}

				tx.gas = gasLimits[i];
			}
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
			assetsToWithdrawSize: runes.length,
		});

		// Here we ensure that transactions passes with minimum fees transferred
		await estimateGasMulti(client as Client, {
			transactions: evmTransactions,
			stateOverride:
				options.stateOverride ??
				(await createStateOverride(config, client, intentions, totalCost)),
			account: evmAddress,
		});

		for (const [i, intention] of evmIntentions.entries()) {
			if (intention.evmTransaction.gas !== undefined) {
				continue;
			}

			intention.evmTransaction.gas = BigInt(
				// Increase gas limit by 20% to account for potential fluctuations
				Math.ceil(Number(gasLimits[i]) * 1.2),
			);
		}
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
		assetsToWithdrawSize: runes.length,
	});

	const btcTransfer = intentions.reduce((acc, it) => {
		return acc + (it?.deposit?.satoshis ?? 0);
	}, 0);

	const transfers: EdictRuneParams["transfers"] = [
		{
			receiver: options.multisigAddress ?? multisigAddress[network.id],
			amount: ensureMoreThanDust(Math.ceil(Number(totalCost) + btcTransfer)),
		},
	];

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
