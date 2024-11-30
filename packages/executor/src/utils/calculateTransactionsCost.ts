import { type Config, getFeeRate } from "@midl-xyz/midl-js-core";
import {
	type Client,
	type StateOverride,
	type TransactionSerializableBTC,
	parseUnits,
} from "viem";
import { estimateGasMulti } from "viem/actions";

const ONE_SATOSHI = parseUnits("10", 10);
const MIDL_SCRIPT_SIZE = 204n;
const RUNES_DEPOSIT_SIZE = 451n;
const DEPOSIT_SIZE = 189n;
const WITHDRAW_SIZE = 164n;
const RUNES_WITHDRAW_SIZE = 401n;

/**
 * Calculate the cost of transactions batch
 *
 * @param transactions - Transactions to calculate cost for
 * @param config - Configuration object
 * @param feeRateMultiplier - Multiplier for fee rate, default is 2 (double the fee rate)
 * @returns Cost of transactions in satoshis
 */
export const calculateTransactionsCost = async (
	transactions: TransactionSerializableBTC[],
	config: Config,
	{
		feeRateMultiplier = 2,
		hasRunesDeposit,
		hasDeposit,
		hasWithdraw,
		hasRunesWithdraw,
	}: {
		feeRateMultiplier?: number;
		hasRunesDeposit?: boolean;
		hasDeposit?: boolean;
		hasWithdraw?: boolean;
		hasRunesWithdraw?: boolean;
	},
) => {
	// TODO: get gas price from the network
	const gasPrice = parseUnits("10", 3);
	const feeRate = await getFeeRate(config);

	const totalGas = transactions.reduce((acc, it) => acc + (it.gas ?? 0n), 0n);

	const btcWithdrawSize = hasWithdraw
		? hasRunesWithdraw
			? RUNES_WITHDRAW_SIZE
			: WITHDRAW_SIZE
		: 0n;
	const btcDepositSize = hasDeposit
		? hasRunesDeposit
			? RUNES_DEPOSIT_SIZE
			: DEPOSIT_SIZE
		: 0n;

	return (
		((gasPrice * totalGas) / ONE_SATOSHI) *
		BigInt(feeRate.halfHourFee * feeRateMultiplier) *
		(MIDL_SCRIPT_SIZE + btcDepositSize + btcWithdrawSize)
	);
};
