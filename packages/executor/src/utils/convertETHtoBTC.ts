import { formatUnits } from "viem";

export const convertETHtoBTC = (value: bigint): number => {
	return Math.ceil(Number(formatUnits(value, 10)));
};
