import { AddressPurpose, connect, disconnect } from "@midl/core";
import { http, type Chain, createWalletClient } from "viem";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { finalizeBTCTransaction } from "~/actions/finalizeBTCTransaction";
import { getEVMFromBitcoinNetwork } from "~/utils";

describe("finalizeBTCTransaction", () => {
	const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);

	const walletClient = createWalletClient({
		chain: chain as Chain,
		transport: http(chain.rpcUrls.default.http[0]),
	});

	beforeEach(async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("throws no intentions", async () => {
		await expect(
			finalizeBTCTransaction(midlConfig, [], walletClient),
		).rejects.toThrowError(
			"Cannot finalize BTC transaction without intentions",
		);
	});
});
