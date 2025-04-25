import type { Config } from "~/createConfig";

export const disconnect = async (config: Config) => {
	const { connection } = config.getState();

	await connection?.beforeDisconnect?.();

	config.setState({
		connection: undefined,
		accounts: [],
	});
};
