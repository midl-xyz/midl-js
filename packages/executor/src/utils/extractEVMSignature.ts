import {
	type Account,
	AddressType,
	getAddressType,
} from "@midl-xyz/midl-js-core";
import { toHex } from "viem";

/**
 *  Extracts EVM signature from a base64 encoded signature.
 *
 * @param signature Base64 encoded signature
 * @param signer Signer account
 */
export const extractEVMSignature = (signature: string, signer: Account) => {
	const addressType = getAddressType(signer.address);
	const signatureBuffer = Buffer.from(signature, "base64");

	const secp256k1N = BigInt(
		"0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
	);
	const secp256k1halfN = secp256k1N / 2n;

	let r: Uint8Array | null = null;
	let s: Uint8Array | null = null;

	let recoveryId: bigint | null = null;

	switch (addressType) {
		case AddressType.P2WPKH: {
			// TODO: fix this signature extraction
			// p2wpkh signature structure:
			// [0x02 or 0x03, WITNESS_DATA_LENGTH_BYTE, …WITNESS_DATA, 0x21, …PUBLIC_KEY_33_BYTE]

			const rBytes = signatureBuffer.slice(6, 6 + signatureBuffer[5]);
			const startS = 6 + signatureBuffer[5];
			const sBytes = signatureBuffer.slice(
				startS + 2,
				startS + 2 + signatureBuffer[startS + 1],
			);

			const rBig = BigInt(toHex(rBytes));
			let sBig = BigInt(toHex(sBytes));

			if (sBig > secp256k1halfN) {
				sBig = secp256k1N - sBig;
				recoveryId = 28n;
			} else {
				recoveryId = 27n;
			}

			r = new Uint8Array(32);
			s = new Uint8Array(32);
			r.set(
				Buffer.from(rBig.toString(16).padStart(2, '0'), "hex"),
				32 - Buffer.from(rBig.toString(16).padStart(2, '0'), "hex").length,
			);
			s.set(
				Buffer.from(sBig.toString(16).padStart(2, '0'), "hex"),
				32 - Buffer.from(sBig.toString(16).padStart(2, '0'), "hex").length,
			);

			break;
		}

		// Don't change. This works.
		case AddressType.P2TR: {
			const signatureWithoutFirstByte = Uint8Array.prototype.slice.call(
				signatureBuffer,
				2,
			);

			r = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 0, 32);

			s = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 32, 64);
			recoveryId = 27n;
			break;
		}

		default: {
			throw new Error("P2SH is not supported");
		}
	}

	if (!r || !s || !recoveryId) {
		throw new Error("Invalid signature");
	}

	return {
		r: toHex(r),
		s: toHex(s),
		v: recoveryId,
	};
};
