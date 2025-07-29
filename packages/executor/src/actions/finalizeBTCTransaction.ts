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
import type { TransactionIntention } from "~/types";
import { calculateTransactionsCost, getEVMAddress } from "~/utils";

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
	 * Custom fee rate
	 */
	feeRate?: number;

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
		options.publicKey ? (it) => it.publicKey === options.publicKey : undefined,
	);

	if (!account) {
		throw new Error("No account found for public key");
	}

	const evmAddress = getEVMAddress(config, account);
	const evmIntentions = intentions.filter((it) => Boolean(it.evmTransaction));
	const evmTransactions = evmIntentions.map((it) => it.evmTransaction);
	const hasWithdraw = intentions.some((it) => it.hasWithdraw);
	const hasRunesWithdraw = intentions.some((it) => it.hasRunesWithdraw);
	const feeRate = customFeeRate ?? Number(await getBTCFeeRate(config, client));

	if (!options.skipEstimateGasMulti) {
		const stateOverride =
			options.stateOverride ??
			(await createStateOverride(config, client, intentions));

		const emvTransactionsWithoutGas = evmTransactions.filter(
			(it) => it.gas === undefined,
		);

		let gasLimits = await estimateGasMulti(client as Client, {
			transactions: emvTransactionsWithoutGas,
			stateOverride,
			account: evmAddress,
		});
		if (!options.stateOverride) {
			const totalGas = gasLimits.reduce((acc, gas) => acc + gas, 0n);

			const totalCost = calculateTransactionsCost(totalGas, {
				feeRate,
				hasWithdraw: hasWithdraw,
				hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
				hasRunesWithdraw: hasRunesWithdraw,
				assetsToWithdrawSize: options.assetsToWithdrawSize ?? 0,
			});

			gasLimits = await estimateGasMulti(client as Client, {
				transactions: emvTransactionsWithoutGas,
				stateOverride: await createStateOverride(
					config,
					client,
					intentions,
					totalCost,
				),
				account: evmAddress,
			});
		}

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
		hasWithdraw: hasWithdraw,
		hasRunesDeposit: intentions.some((it) => it.hasRunesDeposit),
		hasRunesWithdraw: hasRunesWithdraw,
		assetsToWithdrawSize: options.assetsToWithdrawSize ?? 0,
	});

	const btcTransfer = intentions.reduce((acc, it) => {
		return acc + (it?.satoshis ?? 0);
	}, 0);

	const transfers: EdictRuneParams["transfers"] = [
		{
			receiver: options.multisigAddress ?? multisigAddress[network.id],
			amount: ensureMoreThanDust(Math.ceil(Number(totalCost) + btcTransfer)),
		},
	];

	const runes = Array.from(
		intentions
			.filter((it) => it.hasRunesDeposit)
			.flatMap((it) => {
				if (!it.runes || it.runes.length === 0) {
					throw new Error("No rune set");
				}

				return it.runes;
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
