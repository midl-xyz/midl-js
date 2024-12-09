import { ONE_SATOSHI } from "~/utils/calculateTransactionsCost";

export const convertBTCtoETH = (value: number): bigint => {
	return BigInt(value) * ONE_SATOSHI;
};
