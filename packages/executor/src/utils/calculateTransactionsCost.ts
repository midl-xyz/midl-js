import { parseUnits } from "viem";
import { GAS_PRICE } from "~/config";

export const ONE_SATOSHI = parseUnits("1", 10);
export const KEYGEN_TX_SIZE = 15n;
export const RUNES_MAGIC_VALUE = 546n;

const DEPOSIT_BTC = 1 << 0;
const DEPOSIT_RUNES = 1 << 1;
const WITHDRAW_BTC = 1 << 2;
const WITHDRAW_RUNES = 1 << 3;

const scriptSizeMap = new Map<number, bigint>([
	[DEPOSIT_BTC, 190n],
	[DEPOSIT_BTC | DEPOSIT_RUNES, 453n],
	[DEPOSIT_BTC | WITHDRAW_BTC, 233n],
	[DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC, 496n],
	[DEPOSIT_BTC | WITHDRAW_RUNES, 428n],
	[DEPOSIT_BTC | WITHDRAW_BTC | WITHDRAW_RUNES, 471n],
	[DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC | WITHDRAW_RUNES, 539n],
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
	if (hasWithdraw || hasRunesWithdraw) scriptSizeKey |= WITHDRAW_BTC;

	let scriptSize = scriptSizeMap.get(scriptSizeKey);

	if (!scriptSize) {
		console.warn(
			`Unknown script size for the operation: ${scriptSizeKey}. Using maximum size.`,
		);
		scriptSize = scriptSizeMap.get(
			DEPOSIT_BTC | DEPOSIT_RUNES | WITHDRAW_BTC | WITHDRAW_RUNES,
		) as bigint;
	}

	const fees =
		(GAS_PRICE * totalGas) / ONE_SATOSHI +
		(KEYGEN_TX_SIZE +
			scriptSize +
			BigInt(assetsToWithdrawSize) * RUNES_MAGIC_VALUE) *
			BigInt(feeRate);

	return Number(fees);
};
