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

	let btcAddressByte = 0n;

	let r: Uint8Array | null = null;
	let s: Uint8Array | null = null;

	let recoveryId: bigint | null = null;

	switch (addressType) {
		case AddressType.P2WPKH: {
			// TODO: fix this signature extraction
			// p2wpkh signature structure:
			// [0x02 or 0x03, WITNESS_DATA_LENGTH_BYTE, …WITNESS_DATA, 0x21, …PUBLIC_KEY_33_BYTE]
			const pkFirstByte = Uint8Array.prototype.slice.call(
				Buffer.from(signer.publicKey, "hex"),
				0,
				1,
			);

			if (signatureBuffer.length !== 65) {
				throw new Error(`Invalid signature length: ${signatureBuffer.length}`);
			}

			r = Uint8Array.prototype.slice.call(signatureBuffer, 1, 33);
			s = Uint8Array.prototype.slice.call(signatureBuffer, 33, 65);
			recoveryId = BigInt(
				Uint8Array.prototype.slice.call(signatureBuffer, 0, 1)[0],
			);

			btcAddressByte = BigInt(pkFirstByte[0]);

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
		btcAddressByte,
	};
};
