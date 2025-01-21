import type { Config } from "~/createConfig";
import axios from "axios";

export type GetFeeRateResponse = {
	/**
	 * The fastest fee rate in satoshis per byte
	 */
	fastestFee: number;
	/**
	 * The half hour fee rate in satoshis per byte
	 */
	halfHourFee: number;
	/**
	 * The hour fee rate in satoshis per byte
	 */
	hourFee: number;
	/**
	 * The economy fee rate in satoshis per byte
	 */
	economyFee: number;
	/**
	 * The minimum fee rate in satoshis per byte
	 */
	minimumFee: number;
};

/**
 * Gets the recommended fee rate
 *
 * @example
 * ```ts
 * import { getFeeRate } from "@midl-xyz/midl-js-core";
 *
 * const feeRate = await getFeeRate(config);
 * console.log(feeRate);
 * ```
 *
 * @param config  The configuration object
 * @returns The recommended fee rate object
 */
export const getFeeRate = async (
	config: Config,
): Promise<GetFeeRateResponse> => {
	if (!config.network) {
		throw new Error("No network");
	}

	const response = await axios.get<GetFeeRateResponse>(
		`${config.network.rpcUrl}/v1/fees/recommended`,
	);

	return response.data;
};
