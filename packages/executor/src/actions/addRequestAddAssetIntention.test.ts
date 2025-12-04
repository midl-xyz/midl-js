import { AddressPurpose, connect } from "@midl/core";
import { zeroAddress } from "viem";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { addRequestAddAssetIntention } from "~/actions/addRequestAddAssetIntention";
import { SystemContracts } from "~/config";
import { satoshisToWei } from "~/utils";

vi.mock("@midl/core", async (importOriginal) => ({
	...(await importOriginal<typeof import("@midl/core")>()),
	getRune: vi.fn().mockImplementation((_, runeId) => {
		if (runeId === "TESTRUNE") {
			return {
				id: "TESTRUNE",
				supply: {
					premine: BigInt(1000000),
				},
			};
		}

		if (runeId === "RUNEWITHNOSUPPLY") {
			return {
				id: "RUNEWITHNOSUPPLY",
			};
		}

		throw new Error(`Rune with ID ${runeId} not found.`);
	}),
}));

describe("executor | actions | addRequestAddAssetIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	it("creates an intention to add an asset with premine amount", async () => {
		await expect(
			addRequestAddAssetIntention(midlConfig, {
				address: zeroAddress,
				runeId: "TESTRUNE",
				transactionHash:
					"0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
			}),
		).resolves.toMatchObject({
			evmTransaction: {
				to: SystemContracts.Executor,
				data: expect.any(String),
				value: satoshisToWei(10000),
			},
			deposit: {
				satoshis: 10000,
				runes: [
					{
						id: "TESTRUNE",
						amount: BigInt(1000000),
						address: zeroAddress,
					},
				],
			},
		});
	});

	it("throws an error if the rune has no supply information", async () => {
		await expect(
			addRequestAddAssetIntention(midlConfig, {
				address: zeroAddress,
				runeId: "RUNEWITHNOSUPPLY",
				transactionHash:
					"0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
			}),
		).rejects.toThrowError(
			"Rune with ID RUNEWITHNOSUPPLY has no supply information",
		);
	});
});
