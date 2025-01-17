import type { Config } from "~/createConfig";
import axios from "axios";

export type GetRuneBalanceParams = {
	address: string;
	runeId: string;
};

export type GetRuneBalanceResponse = {
	address?: string;
	balance: string;
};

export const getRuneBalance = async (
	config: Config,
	{ address, runeId }: GetRuneBalanceParams,
) => {
	if (!config.network) {
		throw new Error("No network found");
	}

	const response = await axios<GetRuneBalanceResponse>(
		`${config.network.runesUrl}/runes/v1/etchings/${runeId}/holders/${address}`,
	);

	return response.data;
};
