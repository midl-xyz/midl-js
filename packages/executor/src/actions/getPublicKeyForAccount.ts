import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import { getPublicKey } from "~/actions";

export const getPublicKeyForAccount = async (
	config: Config,
	publicKey?: string,
) => {
	const account = getDefaultAccount(config);

	const pk = getPublicKey(config, publicKey ?? account.publicKey);

	if (!pk) {
		throw new Error("No public key found");
	}

	return pk;
};
