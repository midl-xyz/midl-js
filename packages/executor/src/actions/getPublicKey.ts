import ecc from "@bitcoinerlab/secp256k1";
import { type Config, extractXCoordinate } from "@midl-xyz/midl-js-core";
import { initEccLib, networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";

export const getPublicKey = (config: Config, publicKey: string) => {
	if (!publicKey || !config.network) {
		return null;
	}

	// if (publicKey) {
	// 	return toHex(Buffer.from(extractXCoordinate(publicKey), "hex"));
	// }

	initEccLib(ecc);

	const p2tr = payments.p2tr({
		internalPubkey: Buffer.from(extractXCoordinate(publicKey), "hex"),
		network: networks[config.network.network],
	});

	// biome-ignore lint/style/noNonNullAssertion: Output is guaranteed to be defined
	return toHex(p2tr.output!.slice(2));
};
