import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

/**
 * Extracts the x coordinate from a public key
 * @param publicKey hexadecimal public key
 * @returns hexadecimal x coordinate
 */
export const extractXCoordinate = (publicKey: string) => {
	const publicKeyBuffer = hexToBytes(publicKey);

	if (publicKeyBuffer.length === 32) {
		// Assume it's already the x coordinate
		return bytesToHex(publicKeyBuffer);
	}

	if (publicKeyBuffer.length !== 33 && publicKeyBuffer.length !== 65) {
		throw new Error("Invalid public key length");
	}

	const xCoordinate = publicKeyBuffer.subarray(1, 33);

	return bytesToHex(xCoordinate);
};
