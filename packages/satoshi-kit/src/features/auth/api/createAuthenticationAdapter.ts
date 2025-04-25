import type {
	BitcoinNetwork,
	SignMessageProtocol,
} from "@midl-xyz/midl-js-core";

export type AuthenticationAdapter = {
	verify({
		message,
		signature,
	}: { message: string; signature: string; address: string }): Promise<boolean>;
	createMessage(
		address: string,
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
