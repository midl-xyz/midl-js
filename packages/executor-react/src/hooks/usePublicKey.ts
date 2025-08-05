import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { getPublicKey } from "@midl-xyz/midl-js-executor";
import { useConfig, useConfigInternal } from "@midl-xyz/midl-js-react";

type UsePublicKeyParams = {
	/**
	 * The BTC address of the account to get the public key from.
	 */
	from?: string;

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
	from,
	config: customConfig,
}: UsePublicKeyParams = {}) => {
	const { network } = useConfig(customConfig);
	const config = useConfigInternal(customConfig);
	const account = getDefaultAccount(
		config,
		from ? (it) => it.address === from : undefined,
	);

	try {
		return getPublicKey(account, network);
	} catch (e) {
		console.error(e);
		return null;
	}
};
