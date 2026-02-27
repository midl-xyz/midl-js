import {
	AddressPurpose,
	connect,
	createConfig,
	disconnect,
	getDefaultAccount,
} from "@midl/core";
import { keyPairConnector } from "@midl/node";
import { createPublicClient, http, type PublicClient } from "viem";
import * as viemActions from "viem/actions";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	vi,
} from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { midlConfig } from "~/__tests__/midlConfig";
import { getPublicKey } from "~/actions";
import { serializeIntention } from "~/actions/serializeIntention";
import { GAS_PRICE, midlRegtest } from "~/config";
import type { TransactionIntention } from "~/types";
import {
	getBTCAddressByte,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
} from "~/utils";

vi.mock("viem/actions", async (importActual) => {
	const actual = await importActual<typeof import("viem/actions")>();

	return {
		...actual,
		getTransactionCount: vi.fn(),
	};
});

describe("executor | actions | serializeIntention", () => {
	const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);
	const client = createPublicClient({
		chain: midlRegtest,
		transport: http(midlRegtest.rpcUrls.default.http[0]),
	});

	beforeEach(async () => {
		await connect(midlConfig, { purposes: [AddressPurpose.Payment] });
	});

	afterEach(async () => {
		await disconnect(midlConfig);
		(viemActions.getTransactionCount as Mock).mockReset();
	});

	it("serializes intention with derived fields", async () => {
		(viemActions.getTransactionCount as Mock).mockResolvedValue(7);

		const first: TransactionIntention = {
			evmTransaction: {
				to: "0x0000000000000000000000000000000000000001",
				value: 0n,
				chainId: chain.id,
			},
		};
		const second: TransactionIntention = {
			evmTransaction: {
				to: "0x0000000000000000000000000000000000000002",
				value: 0n,
				chainId: chain.id,
			},
		};
		const intentions = [first, second];

		const { intention } = await serializeIntention(
			midlConfig,
			client,
			second,
			intentions,
			{ txId: "abcd" },
		);

		const account = getDefaultAccount(midlConfig);
		const evmAddress = getEVMAddress(account, midlConfig.getState().network);
		const publicKey = getPublicKey(account, midlConfig.getState().network);

		expect(intention.evmTransaction?.chainId).toEqual(chain.id);
		expect(intention.evmTransaction?.from).toEqual(evmAddress);
		expect(intention.evmTransaction?.nonce).toEqual(8);
		expect(intention.evmTransaction?.gasPrice).toEqual(GAS_PRICE);
		expect(intention.evmTransaction?.publicKey).toEqual(publicKey);
		expect(intention.evmTransaction?.btcAddressByte).toEqual(
			getBTCAddressByte(account),
		);
		expect(intention.evmTransaction?.btcTxHash).toEqual("0xabcd");

		expect(second.evmTransaction?.gasPrice).toBeUndefined();
		expect(second.evmTransaction?.btcTxHash).toBeUndefined();
	});

	it("throws when no network is set", async () => {
		const config = createConfig({
			networks: [],
			connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
		});

		await expect(() =>
			serializeIntention(
				config,
				client,
				{ evmTransaction: { value: 0n, chainId: chain.id } },
				[],
				{ txId: "0x1" },
			),
		).rejects.toThrow("No network set");
	});

	it("throws when EVM transaction is missing", async () => {
		await expect(() =>
			serializeIntention(
				midlConfig,
				client,
				{ deposit: { satoshis: 1000 } } as TransactionIntention,
				[],
				{ txId: "0x1" },
			),
		).rejects.toThrow("No EVM transaction set");
	});

	it("throws when EVM chain is missing", async () => {
		(viemActions.getTransactionCount as Mock).mockResolvedValue(0);

		await expect(() =>
			serializeIntention(
				midlConfig,
				{} as PublicClient,
				{ evmTransaction: { value: 0n, chainId: chain.id } },
				[],
				{ txId: "0x1" },
			),
		).rejects.toThrow("No EVM chain set");
	});
});
