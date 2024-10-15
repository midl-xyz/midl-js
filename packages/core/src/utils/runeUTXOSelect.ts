import { parseUnits } from "viem";
import type { RuneUTXO } from "~/actions";

export const runeUTXOSelect = (
  utxos: RuneUTXO[],
  amount: bigint
): RuneUTXO[] => {
  const selectedUTXOs: RuneUTXO[] = [];
  let selectedAmount = 0n;

  for (const utxo of utxos) {
    if (selectedAmount >= amount) {
      break;
    }

    const { amount: runeAmount, divisibility } = utxo.runes[0];

    selectedUTXOs.push(utxo);
    selectedAmount += parseUnits(runeAmount, divisibility);
  }

  return selectedUTXOs;
};
