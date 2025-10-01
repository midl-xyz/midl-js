import { describe, expect, it } from "vitest";
import { mockProvider } from "~/__tests__/provider";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { getBlockNumber } from "./getBlockNumber";

describe("core | actions | getBlockNumber", () => {
	it("returns the correct block number", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		const blockNumber = "1456782";

		mockProvider.getLatestBlockHeight.mockResolvedValue(blockNumber);

		const result = await getBlockNumber(config);
		expect(result).to.be.equal(blockNumber);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		mockProvider.getLatestBlockHeight.mockRejectedValue(
			new Error("Failed to get block number"),
		);

		await expect(getBlockNumber(config)).rejects.toThrow(
			"Failed to get block number",
		);
	});
});
