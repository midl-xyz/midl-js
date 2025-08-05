import type { Config } from "~/createConfig";

/**
 * Disconnects the current wallet connection and clears associated accounts.
 *
 * Calls the connector's beforeDisconnect hook if available, then resets the connection and accounts in the configuration state.
 *
 * @param config - The configuration object.
 *
 * @returns A promise that resolves when the disconnection is complete.
 *
 * @example
 * ```typescript
 * await disconnect(config);
 * ```
 */
export const disconnect = async (config: Config) => {
	const { connection } = config.getState();

	await connection?.beforeDisconnect?.();

	config.setState({
		connection: undefined,
		accounts: undefined,
	});
};
