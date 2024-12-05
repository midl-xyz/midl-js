import { extractXCoordinate } from "@midl-xyz/midl-js-core";
import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { initEccLib, networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";
import * as ecc from "@bitcoinerlab/secp256k1";

type UsePublicKeyParams = {
	/**
	 * The public key to convert to an EVM address.
	 */
	publicKey?: string;
};

/**
 * Custom hook to extract and format the public key into a hexadecimal EVM-compatible format.
 *
 * This hook processes the provided public key or defaults to the payment or ordinals account's public key,
 * converting it to a hexadecimal string suitable for EVM interactions.
 *
 * @example
 * ```typescript
 * const publicKeyHex = usePublicKey({ publicKey: '0xabc123...' });
 * ```
 */
export const usePublicKey = ({ publicKey }: UsePublicKeyParams = {}) => {
	const { ordinalsAccount, paymentAccount } = useAccounts();
	const config = useConfig();

	try {
		const pk =
			publicKey ?? paymentAccount?.publicKey ?? ordinalsAccount?.publicKey;

		if (!pk || !config.network) {
			return null;
		}

		if (paymentAccount) {
			return toHex(Buffer.from(extractXCoordinate(pk), "hex"));
		}

		initEccLib(ecc);

		const p2tr = payments.p2tr({
			internalPubkey: Buffer.from(extractXCoordinate(pk), "hex"),
			network: networks[config.network.network],
		});
		// biome-ignore lint/style/noNonNullAssertion: Output is guaranteed to be defined
		return toHex(p2tr.output!.slice(2));
	} catch (e) {
		console.error(e);
		return null;
	}
};
