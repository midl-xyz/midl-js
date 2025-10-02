import { describe, expect, it } from "vitest";
import { mockRuneProvider } from "~/__tests__/runeProvider";
import { createConfig } from "~/createConfig";
import { mainnet } from "~/networks";
import { getRuneUTXO } from "./getRuneUTXO";

describe("core | actions | getRuneUTXO", () => {
	it("returns the rune UTXO", async () => {
		const address =
			"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";
		const runeId = "111:1";

		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		const runeUTXO = [
			{
				height: 476543,
				address: address,
				txid: "78655ertdfghjkp9878654edrfgcvhjhkiuo76tyghvhgyt78",
				vout: 20,
				satoshis: 546,
				runes: [{ runeId: runeId, amount: "1000000" }],
			},
		];

		mockRuneProvider.getRuneUTXOs.mockResolvedValue(runeUTXO);

		const result = await getRuneUTXO(config, address, runeId);
		expect(result).to.be.equal(runeUTXO);
	});

	it("throws error if the provider fails", async () => {
		const address =
			"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";
		const runeId = "111:1";

		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		mockRuneProvider.getRuneUTXOs.mockRejectedValue(
			new Error("Failed to fetch rune UTXOs for address"),
		);

		await expect(getRuneUTXO(config, address, runeId)).rejects.toThrow(
			"Failed to fetch rune UTXOs for address",
		);
	});
});
