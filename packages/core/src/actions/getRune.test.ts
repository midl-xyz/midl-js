import { describe, expect, it } from "vitest";
import { mockRuneProvider } from "~/__tests__/runeProvider";
import { createConfig } from "~/createConfig";
import { mainnet } from "~/networks";
import { getRune } from "./getRune";

const runeId = "66981:1";

describe("core | actions | getRune", () => {
	it("returns the rune object", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		const runeInfo = {
			id: runeId,
			name: "RUNEFORTESTGETRUNEFUNCTION",
			spaced_name: "RUNE•FOR•TEST•GETRUNE•FUNCTION",
			symbol: "*",
			divisibility: 18,
		};

		mockRuneProvider.getRune.mockResolvedValue(runeInfo);

		const result = await getRune(config, runeId);
		expect(result).to.be.equal(runeInfo);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		mockRuneProvider.getRune.mockRejectedValue(
			new Error("Failed to get rune object"),
		);

		await expect(getRune(config, runeId)).rejects.toThrow(
			"Failed to get rune object",
		);
	});

	it("throws error if config doesn't contains network", async () => {
		const config = createConfig({
			networks: [],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		await expect(getRune(config, runeId)).rejects.toThrow("No network");
	});
});
