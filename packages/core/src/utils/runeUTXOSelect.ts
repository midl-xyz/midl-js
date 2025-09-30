import type { RuneUTXO } from "~/providers";

export const runeUTXOSelect = (
	utxos: RuneUTXO[],
	runeId: string,
	amount: bigint,
): RuneUTXO[] => {
	const selectedUTXOs: RuneUTXO[] = [];
	let selectedAmount = 0n;

	for (const utxo of utxos) {
		if (selectedAmount >= amount) {
			break;
		}

		const rune = utxo.runes.find((rune) => rune.runeid === runeId);

		if (!rune) {
			continue;
		}

		const { amount: runeAmount } = rune;
		selectedUTXOs.push(utxo);
		selectedAmount += runeAmount;
	}

	if (selectedAmount < amount) {
		throw new Error("Insufficient funds");
	}

	return selectedUTXOs;
};
