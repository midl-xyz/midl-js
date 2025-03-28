import type { BitcoinNetwork } from "@midl-xyz/midl-js-core";

export type AuthenticationAdapter = {
	verify({
		message,
		signature,
	}: { message: string; signature: string; address: string }): Promise<boolean>;
	createMessage(address: string, network: BitcoinNetwork): Promise<string>;
	signOut(): Promise<void>;
};

export const createAuthenticationAdapter = (adapter: AuthenticationAdapter) => {
	return adapter;
};
