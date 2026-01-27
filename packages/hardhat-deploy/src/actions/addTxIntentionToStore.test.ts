import {
	AddressPurpose,
	connect,
	createConfig,
	getDefaultAccount,
	regtest,
} from "@midl/core";
import { getEVMAddress } from "@midl/executor";
import { keyPairConnector } from "@midl/node";
import type { Address, PublicClient } from "viem";
import { describe, expect, it, vi } from "vitest";
import { addTxIntentionToStore } from "~/actions/addTxIntentionToStore";
import { createStore } from "~/actions/createStore";

const TEST_MNEMONIC =
	"test test test test test test test test test test test junk";

const createConnectedConfig = async () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [keyPairConnector({ mnemonic: TEST_MNEMONIC })],
	});

	await connect(config, {
		purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
	});

	return config;
};

describe("addTxIntentionToStore", () => {
	it("derives from address, assigns nonce, and stores the intention", async () => {
		const config = await createConnectedConfig();
		const store = createStore();

		const getTransactionCount = vi.fn().mockResolvedValue(3);
		const publicClient = { getTransactionCount } as unknown as PublicClient;

		const expectedFrom = getEVMAddress(
			getDefaultAccount(config),
			config.getState().network,
		);

		const intention = await addTxIntentionToStore(config, store, publicClient, {
			evmTransaction: {
				to: expectedFrom,
				data: "0x",
			},
		});

		expect(getTransactionCount).toHaveBeenCalledWith({ address: expectedFrom });
		expect(intention.evmTransaction?.from).toBe(expectedFrom);
		expect(intention.evmTransaction?.nonce).toBe(3);
		expect(store.getState().intentions).toHaveLength(1);
	});

	it("increments nonce based on pending intentions", async () => {
		const config = await createConnectedConfig();
		const store = createStore();

		const getTransactionCount = vi.fn().mockResolvedValue(10);
		const publicClient = { getTransactionCount } as unknown as PublicClient;
		const toA = "0x0000000000000000000000000000000000000001" as Address;
		const toB = "0x0000000000000000000000000000000000000002" as Address;

		await addTxIntentionToStore(config, store, publicClient, {
			evmTransaction: { data: "0x", to: toA },
		});
		await addTxIntentionToStore(config, store, publicClient, {
			evmTransaction: { data: "0x", to: toB },
		});

		const nonces = store
			.getState()
			.intentions.map((it) => it.evmTransaction?.nonce);

		expect(nonces).toEqual([10, 11]);
	});

	it("respects explicit nonce overrides", async () => {
		const config = await createConnectedConfig();
		const store = createStore();

		const getTransactionCount = vi.fn().mockResolvedValue(1);
		const publicClient = { getTransactionCount } as unknown as PublicClient;
		const to = "0x0000000000000000000000000000000000000003" as Address;

		const intention = await addTxIntentionToStore(config, store, publicClient, {
			evmTransaction: {
				to,
				data: "0x",
				nonce: 99,
			},
		});

		expect(intention.evmTransaction?.nonce).toBe(99);
	});

	it("uses provided from address for nonce lookup and preserves it", async () => {
		const config = await createConnectedConfig();
		const store = createStore();

		const getTransactionCount = vi.fn().mockResolvedValue(4);
		const publicClient = { getTransactionCount } as unknown as PublicClient;

		const customFrom = "0x00000000000000000000000000000000000000DD" as Address;

		const intention = await addTxIntentionToStore(config, store, publicClient, {
			evmTransaction: {
				from: customFrom,
				to: customFrom,
				data: "0x",
			},
		});

		expect(getTransactionCount).toHaveBeenCalledWith({ address: customFrom });
		expect(intention.evmTransaction?.from).toBe(customFrom);
		expect(intention.evmTransaction?.nonce).toBe(4);
	});
});
