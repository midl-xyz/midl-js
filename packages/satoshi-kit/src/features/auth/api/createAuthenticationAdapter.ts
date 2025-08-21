import type { Account, BitcoinNetwork, SignMessageProtocol } from "@midl/core";

export type AuthenticationAdapter = {
	verify({
		message,
		signature,
		account,
	}: {
		message: string;
		signature: string;
		network: BitcoinNetwork;
		account: Account;
	}): Promise<boolean>;
	createMessage(
		account: Account,
		network: BitcoinNetwork,
	): Promise<{
		message: string;
		signMessageProtocol?: SignMessageProtocol;
	}>;
	signOut(): Promise<void>;
};

export const createAuthenticationAdapter = (adapter: AuthenticationAdapter) => {
	return adapter;
};
