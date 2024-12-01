import { extractXCoordinate } from "@midl-xyz/midl-js-core";
import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { networks, payments } from "bitcoinjs-lib";
import { toHex } from "viem";

type usePublicKey = {
	publicKey?: `0x${string}`;
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
 *
 * @param {usePublicKey} [params] - Parameters for extracting the public key.
 * @param {Address} [params.publicKey] - The public key to convert to an EVM address.
 *
 * @returns {string | null} – The hexadecimal representation of the public key, or `null` if unavailable or conversion fails.
 */
export const usePublicKey = ({ publicKey }: usePublicKey = {}) => {
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

		const p2tr = payments.p2tr({
			internalPubkey: Buffer.from(extractXCoordinate(pk), "hex"),
			network: networks[config.network.network],
		});
		// biome-ignore lint/style/noNonNullAssertion: Output is guaranteed to be defined
		return toHex(p2tr.output!.slice(2));
	} catch (e) {
		return null;
	}
};
