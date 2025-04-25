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
		address: "bcrt1puwn2akldaf2hqv64kmkjt3lgutk4se8rlmr8rcpk2v0ygg6zqqtqzzjdq9",
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
				amount: formatUnits(amount, divisibility),
			},
		],
	};
};
