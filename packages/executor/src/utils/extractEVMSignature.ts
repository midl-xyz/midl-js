import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { Signature } from "@noble/secp256k1";
import { toBytes, toHex } from "viem";

/**
 *  Extracts EVM signature from a base64 encoded signature.
 *
 * @param signature Base64 encoded signature
 * @param signer Signer account
 */
export const extractEVMSignature = (
	signature: string,
	protocol: SignMessageProtocol,
) => {
	const signatureBuffer = Buffer.from(signature, "base64");

	let r: Uint8Array | null = null;
	let s: Uint8Array | null = null;

	let recoveryId: bigint | null = null;

	switch (protocol) {
		case SignMessageProtocol.Ecdsa: {
			recoveryId = BigInt((signatureBuffer[0] - 27) & 3);

			const signatureWithoutFirstByte = Uint8Array.prototype.slice.call(
				signatureBuffer,
				1,
			);

			let sig: Signature;

			if (signatureWithoutFirstByte.length === 64) {
				sig = Signature.fromCompact(signatureWithoutFirstByte);
			} else {
				sig = Signature.fromDER(signatureWithoutFirstByte);
			}

			r = toBytes(sig.r);
			s = toBytes(sig.s);

			break;
		}

		// Don't change. This works.
		case SignMessageProtocol.Bip322: {
			const signatureWithoutFirstByte = Uint8Array.prototype.slice.call(
				signatureBuffer,
				2,
			);

			r = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 0, 32);
			s = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 32, 64);
			recoveryId = 27n;
			break;
		}
	}

	if (!r || !s || typeof recoveryId !== "bigint") {
		throw new Error("Invalid signature");
	}

	return {
		r: toHex(r),
		s: toHex(s),
		v: recoveryId,
	};
};
