import { createConfig, edictRune, regtest } from "@midl/core";
import { http, createPublicClient } from "viem";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { addRuneERC20 } from "~/actions/addRuneERC20";
import { midlRegtest } from "~/config";
import "@midl/core";

describe("executor | actions | addRune", () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [],
	});

	const client = createPublicClient({
		transport: http(midlRegtest.rpcUrls.default.http[0]),
	});

	beforeAll(() => {
		vi.mock("@midl/core", async (importOriginal) => ({
			...(await importOriginal<typeof import("@midl/core")>()),
			getBlockNumber: vi.fn().mockResolvedValue(100),
			getRune: vi.fn().mockImplementation((config, runeId) => {
				if (runeId === "JUSTETHCEDRUNE") {
					return {
						name: "JUSTETHCEDRUNE",
						location: { block_height: 95 },
					};
				}
				return {
					name: runeId,
					location: { block_height: 90 },
				};
			}),
			edictRune: vi.fn().mockResolvedValue({
				psbt: "base64-encoded-psbt",
				tx: {
					id: "tx-hash",
					hex: "transaction-hex",
				},
			}),
		}));

		vi.mock("~/actions/getBTCFeeRate", async (importOriginal) => ({
			...(await importOriginal<typeof import("~/actions/getBTCFeeRate")>()),
			getBTCFeeRate: vi.fn().mockResolvedValue(2n),
		}));
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it("throws error if rune name is less than 12 characters", async () => {
		await expect(() => addRuneERC20(config, client, "RUNEONE")).rejects.toThrow(
			"Rune name must be at least 12 characters long",
		);
	});

	it("throws error if confirmations is less than 6", async () => {
		await expect(() =>
			addRuneERC20(config, client, "JUSTETHCEDRUNE"),
		).rejects.toThrow("Confirmations must be at least 6");
	});

	it("returns transaction hash if successful", async () => {
		const result = await addRuneERC20(config, client, "RUNEWITHVALIDNAME");
		expect(result).toBeDefined();
		expect(result.tx.id).toBeDefined();
	});

	it("returns PSBT data if successful", async () => {
		const result = await addRuneERC20(config, client, "RUNEWITHVALIDNAME");
		expect(result.psbt).toBeDefined();
	});

	it("returns transaction hex if successful", async () => {
		const result = await addRuneERC20(config, client, "RUNEWITHVALIDNAME");
		expect(result).toBeDefined();
		expect(result.tx.hex).toBeDefined();
	});

	it("does not publish the transaction if publish is false", async () => {
		await addRuneERC20(config, client, "RUNEWITHVALIDNAME", {
			publish: false,
		});
		expect(edictRune).toHaveBeenCalledWith(
			config,
			expect.objectContaining({ publish: false }),
		);
	});

	it("publishes the transaction if publish is true", async () => {
		await addRuneERC20(config, client, "RUNEWITHVALIDNAME", {
			publish: true,
		});
		expect(edictRune).toHaveBeenCalledWith(
			config,
			expect.objectContaining({ publish: true }),
		);
	});
});
