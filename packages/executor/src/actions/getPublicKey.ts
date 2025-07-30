import ecc from "@bitcoinerlab/secp256k1";
import {
	type Account,
	AddressType,
	type BitcoinNetwork,
	extractXCoordinate,
} from "@midl-xyz/midl-js-core";
import { initEccLib, networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";

/**
 * Return the public key to use for passing along to the EVM network.
 */
export const getPublicKey = (
	account: Account,
	network: BitcoinNetwork,
): `0x${string}` | null => {
	const addressType = account.addressType;

	initEccLib(ecc);

	switch (addressType) {
		case AddressType.P2TR: {
			const p2tr = payments.p2tr({
				internalPubkey: Buffer.from(
					extractXCoordinate(account.publicKey),
					"hex",
				),
				network: networks[network.network],
			});

			// biome-ignore lint/style/noNonNullAssertion: Output is guaranteed to be defined
			return toHex(p2tr.output!.slice(2));
		}

		case AddressType.P2WPKH:
		case AddressType.P2SH_P2WPKH: {
			return `0x${extractXCoordinate(account.publicKey)}`;
		}
	}
};
