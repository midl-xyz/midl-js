import type { Config } from "~/createConfig";
import ky from "ky";

export type RuneUTXO = {
	height: number;
	address: string;
	txid: string;
	vout: number;
	satoshis: number;
	scriptPk: string;
	runes: {
		rune: string;
		runeId: string;
		spacedRune: string;
		amount: string;
		symbol: string;
		divisibility: number;
	}[];
};

export const getRuneUTXO = async (
	config: Config,
	address: string,
	runeId: string,
) => {
	if (!config.network) {
		throw new Error("No network");
	}

	return ky<RuneUTXO[]>(`${config.network.runesUTXOUrl}/utxos/${address}/`, {
		searchParams: {
			runeId,
		},
	}).json();
};
