import ecc from "@bitcoinerlab/secp256k1";
import { hexToBytes } from "@noble/hashes/utils.js";
import * as bitcoin from "bitcoinjs-lib";
import { AddressPurpose } from "~/constants";
import type { BitcoinNetwork } from "~/createConfig";
import { extractXCoordinate } from "~/utils/extractXCoordinate";

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
					pubkey: hexToBytes(publicKey),
					network: bitcoin.networks[network.network],
				}),
				network: bitcoin.networks[network.network],
			}).address;

		case AddressPurpose.Ordinals:
			return bitcoin.payments.p2tr({
				internalPubkey: hexToBytes(extractXCoordinate(publicKey)),
				network: bitcoin.networks[network.network],
			}).address;
		default:
			throw new Error("Unknown address type");
	}
};
