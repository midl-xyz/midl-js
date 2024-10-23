import type { Config } from "~/createConfig";
import ky from "ky";

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

	return ky<GetFeeRateResponse>(
		`${config.network.rpcUrl}/v1/fees/recommended`,
	).json();
};
