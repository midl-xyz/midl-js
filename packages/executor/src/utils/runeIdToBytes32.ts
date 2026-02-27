import { pad, toHex } from "viem";

/**
 * Converts a rune ID string (in the format "blockHeight:txIndex") to a 32-byte pointer value.
 *
 * The rune ID is encoded by combining the block height and transaction index, then padding the result to 32 bytes.
 *
 * @param runeId - The rune ID string, e.g., "12345:1".
 * @returns The 32-byte pointer representation of the rune ID.
 */
export const runeIdToBytes32 = (runeId: string): `0x${string}` => {
	const [blockHeight = "0", txIndex = "0"] = runeId.split(":");

	let bytes32RuneId: `0x${string}` = pad("0x0", { size: 32 });

	try {
		bytes32RuneId = pad(
			toHex((BigInt(blockHeight) << BigInt(32)) | BigInt(txIndex)),
			{ size: 32 },
		);
	} catch {
		// do nothing
	}

	return bytes32RuneId;
};
