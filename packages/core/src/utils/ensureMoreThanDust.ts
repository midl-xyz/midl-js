/**
 * Dust threshold is the minimum value that can be sent in a transaction.
 * We don't use 546 because it overlaps with RUNE's magic value.
 */
export const DUST_THRESHOLD = 547;

/**
 * Ensure that the value is more than the dust threshold.
 *
 * @param value - The value to check.
 * @param dust - The dust threshold.
 *
 * @returns The value if it is more than the dust threshold, otherwise the dust threshold.
 */
export const ensureMoreThanDust = (value: number, dust = DUST_THRESHOLD) => {
	return value >= dust ? value : dust;
};
