import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { getPublicKey } from "@midl-xyz/midl-js-executor";
import { useConfigInternal } from "@midl-xyz/midl-js-react";

type UsePublicKeyParams = {
	/**
	 * The public key to convert to an EVM address.
	 */
	publicKey?: string;

	config?: Config;
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
export const usePublicKey = ({
	publicKey,
	config: customConfig,
}: UsePublicKeyParams = {}) => {
	const config = useConfigInternal(customConfig);
	const account = getDefaultAccount(config);

	try {
		const pk = publicKey || account.publicKey;

		if (!pk) {
			return null;
		}

		return getPublicKey(config, pk);
	} catch (e) {
		console.error(e);
		return null;
	}
};
