import type { Config } from "~/createConfig";

export enum SignMessageProtocol {
	Ecdsa = "ECDSA",
	Bip322 = "BIP322",
}

export type SignMessageParams = {
	address: string;
	message: string;
	protocol?: SignMessageProtocol;
};

export type SignMessageResponse =
	| {
			signature: string;
			address: string;
	  }
	| {
			signature: string;
			address: string;
			protocol: string;
			messageHash: string;
	  };

export const signMessage = (
	config: Config,
	{
		address,
		message,
		protocol = SignMessageProtocol.Bip322,
	}: SignMessageParams,
) => {
	const { currentConnection } = config;

	if (!currentConnection) {
		throw new Error("No provider found");
	}

	return currentConnection.signMessage({
		address,
		message,
		protocol,
	});
};
