import type { Config } from "~/createConfig";
import axios from "axios";

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

	const response = await axios<RuneUTXO[]>(
		`${config.network.runesUTXOUrl}/utxos/${address}/`,
		{
			params: {
				runeId,
			},
		},
	);

	return response.data;
};
