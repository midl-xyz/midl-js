import axios from "axios";
import type { Config } from "~/createConfig";

export const broadcastTransaction = async (
	config: Config,
	txHex: string,
): Promise<string> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const { data } = await axios.post<string>(
		`${config.network.rpcUrl}/tx`,
		txHex,
	);

	return data;
};
