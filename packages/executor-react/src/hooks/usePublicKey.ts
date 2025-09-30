import { type Config, getDefaultAccount } from "@midl/core";
import { getPublicKey } from "@midl/executor";
import { useConfig, useConfigInternal } from "@midl/react";

type UsePublicKeyParams = {
	/**
	 * The BTC address of the account to get the public key from.
	 */
	from?: string;

	/**
	 * Custom configuration to override the default.
	 */
	config?: Config;
};

/**
 * Returns the public key to use for passing along to the EVM network.
 *
 * For P2TR addresses, returns the hex-encoded x-only public key (after removing the first two bytes from the output).
 * For P2WPKH and P2SH_P2WPKH, returns the hex-encoded x-coordinate of the public key.
 *
 * @example
 * ```typescript
 * const publicKeyHex = usePublicKey({ from: 'bcrtq...' });
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
