import { describe, expect, it } from "vitest";
import { mockProvider } from "~/__tests__/provider";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { getFeeRate } from "./getFeeRate.js";

describe("core | actions | getFeeRate", () => {
	it("returns the fee rate correctly", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		const feeRate = "12";

		mockProvider.getFeeRate.mockResolvedValue(feeRate);

		const result = await getFeeRate(config);
		expect(result).to.be.equal(feeRate);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		mockProvider.getFeeRate.mockRejectedValue(
			new Error("Failed to fetch fee rate"),
		);

		await expect(getFeeRate(config)).rejects.toThrow(
			"Failed to fetch fee rate",
		);
	});

	it("throws error if config doesn't contains network", async () => {
		const config = createConfig({
			networks: [],
			connectors: [],
			provider: mockProvider,
		});

		await expect(getFeeRate(config)).rejects.toThrow("No network");
	});
});
