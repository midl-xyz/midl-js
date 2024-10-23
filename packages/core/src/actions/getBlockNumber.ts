import type { Config } from "~/createConfig";
import ky from "ky";

export const getBlockNumber = async (config: Config) => {
	if (!config.network) {
		throw new Error("No network");
	}

	const height = await ky<string>(
		`${config.network.rpcUrl}/blocks/tip/height`,
	).text();

	return Number.parseInt(height, 10);
};
