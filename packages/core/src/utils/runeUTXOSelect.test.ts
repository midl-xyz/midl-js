import { describe, expect, it } from "vitest";
import type { RuneUTXO } from "~/providers";
import { runeUTXOSelect } from "~/utils";

describe("core | utils | runeUTXOSelect", () => {
	it("should return selected UTXOs", () => {
		const utxos = [
			{
				runes: [
					{
						runeid: "1:1",
						divisibility: 18,
						amount: 100n,
					},
				],
			},
			{
				runes: [
					{
						runeid: "1:1",
						divisibility: 18,
						amount: 100n,
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
						amount: 100n,
					},
				],
			},
		] as unknown as RuneUTXO[];

		expect(() => runeUTXOSelect(utxos, "1:1", 200n)).toThrowError(
			"Insufficient funds",
		);
	});
});
