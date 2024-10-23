import type { Config } from "~/createConfig";
import ky from "ky";

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

	return ky<GetRuneBalanceResponse>(
		`${config.network.runesUrl}/runes/v1/etchings/${runeId}/holders/${address}`,
	).json();
};
