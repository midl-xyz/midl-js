import type { Config } from "~/createConfig";

export enum SignMessageProtocol {
	Ecdsa = "ECDSA",
	Bip322 = "BIP322",
}

export type SignMessageParams = {
	/**
	 * The address to sign the message with
	 */
	address: string;
	/**
	 * The message to sign
	 */
	message: string;
	/**
	 * The protocol to use for signing.
	 */
	protocol?: SignMessageProtocol;
};

export type SignMessageResponse = (
	| {
			/**
			 * Base64 encoded signature
			 */
			signature: string;
			/**
			 * The address that signed the message
			 */
			address: string;
	  }
	| {
			/**
			 * Base64 encoded signature
			 */
			signature: string;
			/**
			 * The address that signed the message
			 */
			address: string;

			/**
			 * The message hash
			 */
			messageHash: string;
	  }
) & {
	protocol: SignMessageProtocol;
};

/**
 * Signs a message with the given address and message.
 * Supports ECDSA and BIP322 protocols
 *
 * @example
 * ```ts
 * const signature = await signMessage(config, {
 * 	address: "bc1q...",
 * 	message: "Hello, world!",
 * });
 * ```
 *
 * @param config The configuration object
 * @param params The parameters for the request
 * @returns The signature response
 */
export const signMessage = (
	config: Config,
	{
		address,
		message,
		protocol = SignMessageProtocol.Bip322,
	}: SignMessageParams,
) => {
	const { connection, network } = config.getState();

	if (!connection) {
		throw new Error("No provider found");
	}

	return connection.signMessage(
		{
			address,
			message,
			protocol,
		},
		network,
	);
};
