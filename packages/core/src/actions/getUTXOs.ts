import type { Config } from "~/createConfig";
import ky from "ky";

type UTXO = {
	readonly txid: string;
	readonly vout: number;
	readonly value: number;
	readonly status: {
		readonly confirmed: boolean;
		readonly block_height: number;
		readonly block_hash: string;
		readonly block_time: number;
	};
};

export const getUTXOs = async (
	config: Config,
	address: string,
): Promise<UTXO[]> => {
	if (!config.network) {
		throw new Error("No network");
	}

	return ky<UTXO[]>(`${config.network.rpcUrl}/address/${address}/utxo`).json();
};
