import { randomBytes } from "node:crypto";
import { formatUnits } from "viem";

export const makeRuneUTXO = (
	runeId: string,
	amount: bigint,
	divisibility = 18,
) => {
	return {
		txid: randomBytes(32).toString("hex"),
		vout: 0,
		address: "bcrt1pfewlxm8meyyvgjydfu7v8j4ej64symj6ut8sf66h9germp94qgzs92e5zv",
		scriptPk:
			"5120e3a6aedbedea55703355b6ed25c7e8e2ed5864e3fec671e036531e4423420016",
		satoshis: 546,
		height: 48475,
		confirmations: 97499,
		runes: [
			{
				runeid: runeId,
				rune: "MOCKRUNE",
				spacedRune: "MOCK•RUNE",
				symbol: "¤",
				divisibility,
				amount: BigInt(formatUnits(amount, divisibility)),
			},
		],
	};
};
