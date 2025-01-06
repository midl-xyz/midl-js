import { AddressPurpose, type Config } from "@midl-xyz/midl-js-core";
import { getPublicKey } from "~/actions";

export const getPublicKeyForAccount = async (
	config: Config,
	publicKey?: string,
) => {
	const accounts = await config.currentConnection?.getAccounts();

	const ordinalsAccount = accounts?.find(
		(it) => it.purpose === AddressPurpose.Ordinals,
	);
	const paymentAccount = accounts?.find(
		(it) => it.purpose === AddressPurpose.Payment,
	);

	const pk = getPublicKey(
		config,
		publicKey ?? paymentAccount?.publicKey ?? ordinalsAccount?.publicKey ?? "",
	);

	if (!pk) {
		throw new Error("No public key found");
	}

	return pk;
};
