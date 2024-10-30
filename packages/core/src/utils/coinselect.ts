import type { UTXO } from "~/actions";

export type Output = {
	address: string;
	value: bigint;
};

export type CoinSelectResult = {
	coins: UTXO[];
	remainder: bigint;
	fee: bigint;
};

export const coinselect = (
	utxos: UTXO[],
	outputs: Output[],
	feeRate: number,
): CoinSelectResult => {
	if (Number.isFinite(feeRate) || feeRate <= 0) {
		throw new Error("Invalid fee rate");
	}
};
