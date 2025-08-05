/**
 * Decodes a 32-byte pointer value back to a rune ID string in the format "blockHeight:txIndex".
 *
 * @param bytes32RuneId - The 32-byte pointer value (hex string).
 * @returns The rune ID string, e.g., "12345:1".
 */
export const bytes32toRuneId = (bytes32RuneId: `0x${string}`) => {
	const blockHeight = BigInt(bytes32RuneId) >> BigInt(32);
	const txIndex = BigInt(bytes32RuneId) & BigInt(0xffffffff);

	return `${blockHeight}:${txIndex}`;
};
