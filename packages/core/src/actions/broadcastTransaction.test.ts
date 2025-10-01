import { describe, expect, it } from "vitest";
import { mockProvider } from "~/__tests__/provider";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

describe("core | actions | broadcastTransaction", async () => {
	it("broadcasts transaction", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		const txHash = "mocked-tx-hash";

		mockProvider.broadcastTransaction.mockResolvedValue(txHash);

		const result = await broadcastTransaction(config, "txHex");

		expect(result).toBe(txHash);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		mockProvider.broadcastTransaction.mockRejectedValue(
			new Error("Failed to broadcast transaction"),
		);

		await expect(broadcastTransaction(config, "txHex")).rejects.toThrow(
			"Failed to broadcast transaction",
		);
	});
});
