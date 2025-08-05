import { formatUnits } from "viem";

/**
 * Converts a value in wei to its equivalent in satoshis.
 *
 * 1 satoshi equals 10,000,000,000 wei.
 * The conversion is performed as:
 *   satoshis = ceil(wei / 10^10)
 *
 * @param value - The value in wei.
 * @returns The equivalent value in satoshis, rounded up.
 */
export const weiToSatoshis = (value: bigint): number => {
	return Math.ceil(Number(formatUnits(value, 10)));
};
