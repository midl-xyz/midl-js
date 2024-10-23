import ky from "ky";
import type { Config } from "~/createConfig";

export const broadcastTransaction = async (
	config: Config,
	txHex: string,
): Promise<string> => {
	if (!config.network) {
		throw new Error("No network");
	}

	return ky
		.post<string>(`${config.network.rpcUrl}/tx`, {
			body: txHex,
		})
		.text();
};
