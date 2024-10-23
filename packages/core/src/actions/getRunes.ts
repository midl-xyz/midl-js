import type { Config } from "~/createConfig";
import ky from "ky";

export type GetRunesParams = {
	limit?: number;
	offset?: number;
	address: string;
};

export type GetRunesResponse = {
	limit: number;
	offset: number;
	total: number;
	results: {
		rune: {
			id: string;
			number: number;
			name: string;
			spaced_name: string;
		};
		balance: string;
		address: string;
	}[];
};

export const getRunes = async (
	config: Config,
	{ address, limit = 20, offset = 0 }: GetRunesParams,
) => {
	if (!config.network) {
		throw new Error("No network found");
	}

	return ky
		.get<GetRunesResponse>(
			`${config.network.runesUrl}/runes/v1/addresses/${address}/balances`,
			{
				searchParams: {
					limit,
					offset,
				},
			},
		)
		.json();
};
