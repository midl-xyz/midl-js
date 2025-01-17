import type { Config } from "~/createConfig";
import axios from "axios";

export type GetFeeRateResponse = {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	economyFee: number;
	minimumFee: number;
};

export const getFeeRate = async (
	config: Config,
): Promise<GetFeeRateResponse> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const response = await axios<GetFeeRateResponse>(
		`${config.network.rpcUrl}/v1/fees/recommended`,
	);

	return response.data;
};
