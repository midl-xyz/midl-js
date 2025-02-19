import { formatUnits } from "viem";
import { describe, expect, it } from "vitest";
import type { RuneUTXO } from "~/actions";
import { runeUTXOSelect } from "~/utils";

describe("runeUTXOSelect", () => {
	it("should return selected UTXOs", () => {
		const utxos = [
			{
				runes: [
					{
						runeid: "1:1",
						divisibility: 18,
						amount: formatUnits(100n, 18),
					},
				],
			},
			{
				runes: [
					{
						runeid: "1:1",
						divisibility: 18,
						amount: formatUnits(100n, 18),
					},
				],
			},
		] as unknown as RuneUTXO[];

		const selectedUTXOs = runeUTXOSelect(utxos, "1:1", 200n);

		expect(selectedUTXOs.length).toBe(2);
	});

	it("should throw if insufficient funds", () => {
		const utxos = [
			{
				runes: [
					{
						runeid: "1:1",
						divisibility: 18,
						amount: formatUnits(100n, 18),
					},
				],
			},
		] as unknown as RuneUTXO[];

		expect(() => runeUTXOSelect(utxos, "1:1", 200n)).toThrowError(
			"Insufficient funds",
		);
	});
});
