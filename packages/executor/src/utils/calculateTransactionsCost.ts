import { parseUnits } from "viem";
import { GAS_PRICE } from "~/config";

export const ONE_SATOSHI = parseUnits("1", 10);
export const KEYGEN_TX_SIZE = 11n;
export const BTC_TX_MIN_OUTGOING_BYTES = 363n;
export const RUNES_MAGIC_VALUE = 546n;
export const BTC_TX_INPUT_VBYTES = 58n;
export const BTC_EDICT_SIZE = 32n;
export const BTC_TX_MAX_OUTPUT_VBYTES = 43n;
export const BTC_WITHDRAWAL_VBYTES = 20n;

const DEPOSIT_BTC = 1 << 0;
const DEPOSIT_RUNES = 1 << 1;
const WITHDRAW_BTC = 1 << 2;
const WITHDRAW_RUNES = 1 << 3;

const scriptSizeMap = new Map<number, bigint>([
	[DEPOSIT_BTC, BTC_TX_MIN_OUTGOING_BYTES],
	[DEPOSIT_BTC | DEPOSIT_RUNES, BTC_TX_MIN_OUTGOING_BYTES],
	[
		DEPOSIT_BTC | WITHDRAW_BTC,
		BTC_TX_MIN_OUTGOING_BYTES + BTC_WITHDRAWAL_VBYTES,
	],
	[
		DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC,
		BTC_TX_MIN_OUTGOING_BYTES + BTC_WITHDRAWAL_VBYTES,
	],
	[
		DEPOSIT_BTC | WITHDRAW_RUNES,
		BTC_TX_MIN_OUTGOING_BYTES + BTC_TX_MAX_OUTPUT_VBYTES,
	],
	[
		DEPOSIT_BTC | WITHDRAW_BTC | WITHDRAW_RUNES,
		BTC_TX_MIN_OUTGOING_BYTES +
			BTC_WITHDRAWAL_VBYTES +
			BTC_TX_MAX_OUTPUT_VBYTES,
	],
	[
		DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC | WITHDRAW_RUNES,
		BTC_TX_MIN_OUTGOING_BYTES +
			BTC_WITHDRAWAL_VBYTES +
			BTC_TX_MAX_OUTPUT_VBYTES,
	],
]);

/**
 * Calculate the cost of transactions batch
 *
 * @param totalGas - The total gas used by the transactions.
 * @param options - Options for transaction cost calculation.
 *   @param feeRate - The fee rate in satoshis per byte.
 *   @param hasRunesDeposit - Whether the batch includes a runes deposit.
 *   @param hasWithdraw - Whether the batch includes a Bitcoin withdrawal.
 *   @param hasRunesWithdraw - Whether the batch includes a runes withdrawal.
 *   @param assetsToWithdrawSize - The number of assets to withdraw (default is 0).
 * @returns Cost of transactions in satoshis.
 */
export const calculateTransactionsCost = (
	totalGas: bigint,
	{
		feeRate,
		hasRunesDeposit,
		hasWithdraw,
		hasRunesWithdraw,
		assetsToWithdrawSize = 0,
	}: {
		feeRate: number;
		hasRunesDeposit?: boolean;
		hasWithdraw?: boolean;
		hasRunesWithdraw?: boolean;
		assetsToWithdrawSize?: number;
	},
) => {
	let scriptSizeKey = DEPOSIT_BTC;

	if (hasRunesDeposit) scriptSizeKey |= DEPOSIT_RUNES;
	if (hasRunesWithdraw) scriptSizeKey |= WITHDRAW_RUNES;
	if (hasWithdraw) scriptSizeKey |= WITHDRAW_BTC;

	let scriptSize = scriptSizeMap.get(scriptSizeKey);

	if (!scriptSize) {
		console.warn(
			`Unknown script size for the operation: ${scriptSizeKey}. Using maximum size.`,
		);
		scriptSize = scriptSizeMap.get(
			DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC | WITHDRAW_RUNES,
		) as bigint;
	}

	const reminder = (GAS_PRICE * totalGas) % ONE_SATOSHI ? 1n : 0n;

	const fees =
		(GAS_PRICE * totalGas) / ONE_SATOSHI + // Fee for gas
		reminder + // Rounding up to the nearest satoshi
		(scriptSize +
			KEYGEN_TX_SIZE +
			(hasRunesDeposit ? BTC_TX_INPUT_VBYTES : 0n) +
			BigInt(assetsToWithdrawSize) * BTC_EDICT_SIZE +
			(assetsToWithdrawSize > 0 ? RUNES_MAGIC_VALUE : 0n)) *
			BigInt(Math.ceil(feeRate));

	return Number(fees);
};
