import { type TransactionSerializableBTC, parseUnits } from "viem";

export const ONE_SATOSHI = parseUnits("1", 10);
export const KEYGEN_TX_SIZE = 15n;
export const RUNES_MAGIC_VALUE = 546n;

const DEPOSIT_BTC = 1 << 0;
const DEPOSIT_RUNES = 1 << 1;
const WITHDRAW_BTC = 1 << 2;
const WITHDRAW_RUNES = 1 << 3;

const scriptSizeMap = new Map<number, bigint>([
	[0, 0n],
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
 * @param transactions - Transactions to calculate cost for
 * @param config - Configuration object
 * @param feeRate - Multiplier for fee rate, default is 2 (double the fee rate)
 * @returns Cost of transactions in satoshis
 */
export const calculateTransactionsCost = (
	transactions: Pick<TransactionSerializableBTC, "gas">[],
	{
		gasPrice = parseUnits("10", 3),
		feeRate,
		hasRunesDeposit,
		hasWithdraw,
		hasRunesWithdraw,
		assetsToWithdrawSize = 0,
	}: {
		feeRate: number;
		gasPrice?: bigint;
		hasRunesDeposit?: boolean;
		hasWithdraw?: boolean;
		hasRunesWithdraw?: boolean;
		assetsToWithdrawSize?: number;
	},
) => {
	const totalGas = transactions.reduce((acc, it) => acc + (it.gas ?? 0n), 0n);

	let scriptSizeKey = DEPOSIT_BTC;

	if (hasRunesDeposit) scriptSizeKey |= DEPOSIT_RUNES;
	if (hasWithdraw) scriptSizeKey |= WITHDRAW_BTC;
	if (hasRunesWithdraw) scriptSizeKey |= WITHDRAW_RUNES;

	const scriptSize = scriptSizeMap.get(scriptSizeKey) as bigint;

	const fees =
		(gasPrice * totalGas) / ONE_SATOSHI +
		(KEYGEN_TX_SIZE +
			scriptSize +
			BigInt(assetsToWithdrawSize) * RUNES_MAGIC_VALUE) *
			BigInt(feeRate);

	return fees;
};
