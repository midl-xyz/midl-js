import axios from "axios";
import type { Config } from "~/createConfig";

export const broadcastTransaction = async (
	config: Config,
	txHex: string,
): Promise<string> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const data = await fetch(`${config.network.rpcUrl}/tx`, {
		method: "POST",
		body: txHex,
	});

	// const response = await axios.post<string>(`${config.network.rpcUrl}/tx`, {
	// 	body: txHex,
	// 	headers: {
	// 		"Content-Type": "text/plain",
	// 	},
	// });

	return data.text();
};
