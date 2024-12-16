import { AddressPurpose } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";
import * as bitcoin from "bitcoinjs-lib";
import { extractXCoordinate } from "~/utils/extractXCoordinate";
import ecc from "@bitcoinerlab/secp256k1";

bitcoin.initEccLib(ecc);

export const makeAddress = async (
	publicKey: string,
	purpose: AddressPurpose,
	network: BitcoinNetwork,
) => {
	switch (purpose) {
		case AddressPurpose.Payment:
			return bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wpkh({
					pubkey: Buffer.from(publicKey, "hex"),
					network: bitcoin.networks[network.network],
				}),
				network: bitcoin.networks[network.network],
			}).address;

		case AddressPurpose.Ordinals:
			return bitcoin.payments.p2tr({
				internalPubkey: Buffer.from(extractXCoordinate(publicKey), "hex"),
				network: bitcoin.networks[network.network],
			}).address;
		default:
			throw new Error("Unknown address type");
	}
};
