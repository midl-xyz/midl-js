import { AddressPurpose, connect } from "@midl/core";
import { zeroAddress } from "viem";
import { beforeEach, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { addRequestAddAssetIntention } from "~/actions/addRequestAddAssetIntention";
import { SystemContracts } from "~/config";
import { satoshisToWei } from "~/utils";

describe("executor | actions | addRequestAddAssetIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
		});
	});

	it("creates an intention to add an asset", async () => {
		await expect(
			addRequestAddAssetIntention(midlConfig, {
				address: zeroAddress,
				runeId: "TESTRUNE",
				amount: 1000000n,
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
});
