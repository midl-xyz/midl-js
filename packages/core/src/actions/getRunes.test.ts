import { describe, expect, it } from "vitest";
import { mockRuneProvider } from "~/__tests__/runeProvider";
import { createConfig } from "~/createConfig";
import { mainnet } from "~/networks";
import { getRunes } from "./getRunes";

describe("core | actions | getRunes", () => {
	it("returns the runes for the address", async () => {
		const address =
			"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";
		const balance = "10000";

		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		const runes = {
			total: 3,
			limit: 3,
			offset: 0,
			results: [
				{
					rune: {
						id: "111:1",
						name: "RUNEFORTESTINGA",
						spaced_name: "RUNE•FOR•TESTING•A",
					},
					address: address,
					balance: balance,
				},

				{
					rune: {
						id: "222:2",
						name: "RUNEFORTESTINGB",
						spaced_name: "RUNE•FOR•TESTING•B",
					},
					address: address,
					balance: balance,
				},
				{
					rune: {
						id: "333:3",
						name: "RUNEFORTESTINGC",
						spaced_name: "RUNE•FOR•TESTING•C",
					},
					address: address,
					balance: balance,
				},
			],
		};

		mockRuneProvider.getRunes.mockResolvedValue(runes);

		const result = await getRunes(config, { address: address });
		expect(result).to.be.equal(runes);
	});

	it("throws error if the provider fails", async () => {
		const address =
			"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";

		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		mockRuneProvider.getRunes.mockRejectedValue(
			new Error("Failed to fetch runes for address"),
		);

		await expect(getRunes(config, { address: address })).rejects.toThrow(
			"Failed to fetch runes for address",
		);
	});
});
