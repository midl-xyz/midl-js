import { useAccounts, useConfig } from "@midl-xyz/midl-js-react";
import { getPublicKey } from "@midl-xyz/midl-js-executor";

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

		// biome-ignore lint/style/noNonNullAssertion: Public key is guaranteed to be defined
		return getPublicKey(config, pk!);
	} catch (e) {
		console.error(e);
		return null;
	}
};
