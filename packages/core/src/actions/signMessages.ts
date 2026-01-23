import {
	type SignMessageParams,
	type SignMessageResponse,
	signMessage,
} from "~/actions/signMessage";
import type { Config } from "~/createConfig";

/**
 * Signs multiple messages in a single request.
 * Supports ECDSA and BIP322 protocols.
 *
 * @example
 * ```ts
 * const signatures = await signMessages(config, [
 * 	{ address: "bc1q...", message: "Hello, world!" },
 * 	{ address: "bc1q...", message: "Second message" },
 * ]);
 *
 * console.log(signatures);
 * ```
 *
 * @param config The configuration object
 * @param messages The messages to sign
 * @returns The signature responses
 */
export const signMessages = async (
	config: Config,
	messages: SignMessageParams[],
): Promise<SignMessageResponse[]> => {
	const { connection, network } = config.getState();

	if (!connection) {
		throw new Error("No provider found");
	}

	if (typeof connection.signMessages !== "function") {
		console.warn(
			"signMessages is not supported by the current provider, falling back to individual requests.",
		);
		const signatures: SignMessageResponse[] = [];

		for (const message of messages) {
			const response = await signMessage(config, message);
			signatures.push(response);
		}

		return signatures;
	}

	return connection.signMessages(messages, network);
};
