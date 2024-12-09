import { type Config, getFeeRate } from "@midl-xyz/midl-js-core";
import { type TransactionSerializableBTC, parseUnits } from "viem";

export const ONE_SATOSHI = parseUnits("1", 10);
export const MIDL_SCRIPT_SIZE = 206n;
export const RUNES_DEPOSIT_SIZE = 453n;
export const DEPOSIT_SIZE = 190n;
export const WITHDRAW_SIZE = 165n;
export const RUNES_WITHDRAW_SIZE = 403n;

/**
 * Calculate the cost of transactions batch
 *
 * @param transactions - Transactions to calculate cost for
 * @param config - Configuration object
 * @param feeRateMultiplier - Multiplier for fee rate, default is 2 (double the fee rate)
 * @returns Cost of transactions in satoshis
 */
export const calculateTransactionsCost = async (
	transactions: Pick<TransactionSerializableBTC, "gas">[],
	config: Config,
	{
		gasPrice = parseUnits("10", 3),
		feeRateMultiplier = 2,
		hasRunesDeposit,
		hasDeposit,
		hasWithdraw,
		hasRunesWithdraw,
	}: {
		gasPrice?: bigint;
		feeRateMultiplier?: number;
		hasRunesDeposit?: boolean;
		hasDeposit?: boolean;
		hasWithdraw?: boolean;
		hasRunesWithdraw?: boolean;
	},
) => {
	const feeRate = await getFeeRate(config);
	const totalGas = transactions.reduce((acc, it) => acc + (it.gas ?? 0n), 0n);

	const btcWithdrawSize =
		hasWithdraw || hasRunesWithdraw
			? hasRunesWithdraw
				? RUNES_WITHDRAW_SIZE
				: WITHDRAW_SIZE
			: 0n;
	const btcDepositSize =
		hasDeposit || hasRunesDeposit
			? hasRunesDeposit
				? RUNES_DEPOSIT_SIZE
				: DEPOSIT_SIZE
			: 0n;

	const fees =
		(gasPrice * totalGas) / ONE_SATOSHI +
		(MIDL_SCRIPT_SIZE + btcDepositSize + btcWithdrawSize) *
			BigInt(feeRate.halfHourFee * feeRateMultiplier);

	return fees;
};
