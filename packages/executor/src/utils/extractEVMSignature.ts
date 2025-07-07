import { AddressType, SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { Signature } from "@noble/secp256k1";
import { publicKeyConvert } from "secp256k1";
import { recoverPublicKey, toBytes, toHex } from "viem";
import { getBIP322Hash } from "~/utils";

/**
 *  Extracts EVM signature from a base64 encoded signature.
 *
 * @param signature Base64 encoded signature
 * @param signer Signer account
 */
export const extractEVMSignature = async (
	message: string,
	signature: string,
	protocol: SignMessageProtocol,
	{
		addressType,
		publicKey,
	}: {
		addressType: AddressType;
		publicKey: string;
	},
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

			if (recoveryId < 0n || recoveryId > 3n) {
				throw new Error("Invalid recovery id");
			}

			recoveryId = recoveryId < 27n ? recoveryId + 27n : recoveryId;

			break;
		}

		case SignMessageProtocol.Bip322: {
			if (addressType === AddressType.P2TR) {
				const signatureWithoutFirstByte = Uint8Array.prototype.slice.call(
					signatureBuffer,
					2,
				);

				r = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 0, 32);
				s = Uint8Array.prototype.slice.call(signatureWithoutFirstByte, 32, 64);
				recoveryId = 27n;
			}

			if ([AddressType.P2SH_P2WPKH, AddressType.P2WPKH].includes(addressType)) {
				const secp256k1N = BigInt(
					"0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
				);
				const secp256k1halfN = secp256k1N / 2n;
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
				}

				recoveryId = null;

				r = new Uint8Array(32);
				s = new Uint8Array(32);
				r.set(Buffer.from(rBig.toString(16).padStart(64, "0"), "hex"));
				s.set(Buffer.from(sBig.toString(16).padStart(64, "0"), "hex"));

				try {
					await verifyBIP322Signature(message, toHex(r), toHex(s), 27n, {
						addressType,
						publicKey,
					});

					recoveryId = 27n;
				} catch {
					await verifyBIP322Signature(message, toHex(r), toHex(s), 28n, {
						addressType,
						publicKey,
					});
					recoveryId = 28n;
				}
			}

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

export const verifyBIP322Signature = async (
	message: string,
	r: `0x${string}`,
	s: `0x${string}`,
	v: bigint,
	{
		addressType,
		publicKey,
	}: {
		addressType: AddressType;
		publicKey: string;
	},
) => {
	const recovered = await recoverPublicKey({
		hash: getBIP322Hash(message, addressType, publicKey),
		signature: {
			r,
			s,
			v,
		},
	});

	const converted = Buffer.from(
		publicKeyConvert(Buffer.from(recovered.slice(2), "hex"), true),
	)
		.toString("hex")
		.substring(2);

	if (converted !== publicKey.slice(2)) {
		throw new Error(
			`Public key mismatch: expected ${publicKey.slice(2)}, got ${converted}`,
		);
	}

	return true;
};
