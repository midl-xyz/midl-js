import { describe, expect, it } from "vitest";
import { mockProvider } from "~/__tests__/provider";
import { getUTXOs } from "~/actions/getUTXOs";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

const address =
	"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";

describe("core | actions | getUTXOs", () => {
	it("returns the UTXO", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		const utxo = {
			txid: "76546tuykhjhgftr67897656erfdghguy8u9oipklnmjhkiu",
			vout: 0,
			value: 100000000,
			status: {
				confirmed: true,
				block_height: 0,
				block_hash:
					"657terdfgvbgfhytu768uiojknjhuyi756467879809opljkjhfyut76879809",
				block_time: 0,
			},
		};

		mockProvider.getUTXOs.mockResolvedValue(utxo);

		const result = await getUTXOs(config, address, true);

		expect(result).to.be.equal(utxo);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
			provider: mockProvider,
		});

		mockProvider.getUTXOs.mockRejectedValue(new Error("Failed to fetch UTXOs"));

		await expect(getUTXOs(config, address)).rejects.toThrow(
			"Failed to fetch UTXOs",
		);
	});
});
