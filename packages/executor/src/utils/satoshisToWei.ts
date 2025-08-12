import { ONE_SATOSHI } from "~/utils/calculateTransactionsCost";

/**
 * Converts a value in satoshis to its equivalent in wei.
 *
 * @param value - The number of satoshis to convert.
 * @returns The equivalent value in wei.
 */
export const satoshisToWei = (value: number): bigint => {
	return BigInt(value) * ONE_SATOSHI;
};
