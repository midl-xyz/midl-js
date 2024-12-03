import { getUTXOs } from "~/actions/getUTXOs";
import type { Config } from "~/createConfig";

export const getBalance = async (config: Config, address: string) => {
	if (!config.network) {
		throw new Error("No network");
	}

	const utxos = await getUTXOs(config, address);

	return utxos.reduce((acc, utxo) => acc + utxo.value, 0);
};
