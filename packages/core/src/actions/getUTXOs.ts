import type { Config } from "~/createConfig";
import axios from "axios";

export type UTXO = {
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

const RUNE_MAGIC_VALUE = 546;

export const getUTXOs = async (
	config: Config,
	address: string,
	includeRunes = false,
): Promise<UTXO[]> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const { data: utxos } = await axios.get<UTXO[]>(
		`${config.network.rpcUrl}/address/${address}/utxo`,
	);

	if (!includeRunes) {
		return utxos.filter((utxo) => utxo.value !== RUNE_MAGIC_VALUE);
	}

	return utxos;
};
