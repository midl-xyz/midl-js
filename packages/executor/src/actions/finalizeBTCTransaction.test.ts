import { AddressPurpose, connect, disconnect } from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import { http, type Chain, createWalletClient } from "viem";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createStore } from "zustand";
import { midlConfig } from "~/__tests__/midlConfig";
import { finalizeBTCTransaction } from "~/actions/finalizeBTCTransaction";
import { getEVMFromBitcoinNetwork } from "~/utils";

describe("finalizeBTCTransaction", () => {
	const store = createStore<MidlContextState>()(() => ({}));
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
			finalizeBTCTransaction(midlConfig, store, walletClient),
		).rejects.toThrowError(
			"Cannot finalize BTC transaction without intentions",
		);
	});
});
