import { describe, expect, it } from "vitest";
import { mockRuneProvider } from "~/__tests__/runeProvider";
import { createConfig } from "~/createConfig";
import { mainnet } from "~/networks";
import { getRuneBalance } from "./getRuneBalance";

const address =
	"bc1p3d3z4r6h2r9v5g8j7f4d2q1c0b8e7a6k5j4l3m2n1p0q9r8s7t6u5v4w3x2y1z0a9b8c7";
const runeId = "111:1";

describe("core | actions | getRuneBalance", () => {
	it("returns the rune balance", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		const runeBalance = {
			address: address,
			balance: "168000000000000000000",
		};

		mockRuneProvider.getRuneBalance.mockResolvedValue(runeBalance);

		const result = await getRuneBalance(config, { address, runeId });
		expect(result).to.be.equal(runeBalance);
	});

	it("throws error if the provider fails", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
			runesProvider: mockRuneProvider,
		});

		mockRuneProvider.getRuneBalance.mockRejectedValue(
			new Error("Failed to fetch rune balance for address"),
		);

		await expect(getRuneBalance(config, { address, runeId })).rejects.toThrow(
			"Failed to fetch rune balance for address",
		);
	});
});
