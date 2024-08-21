import type { RuneUTXO } from "~/actions";

export const runeUTXOSelect = (
  utxos: RuneUTXO[],
  amount: bigint
): RuneUTXO[] => {
  const selectedUTXOs: RuneUTXO[] = [];
  let selectedAmount = 0;

  for (const utxo of utxos) {
    if (selectedAmount >= amount) {
      break;
    }

    selectedUTXOs.push(utxo);
    selectedAmount += utxo.runes[0].amount;
  }

  return selectedUTXOs;
};
