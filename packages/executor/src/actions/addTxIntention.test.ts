import {
	AddressPurpose,
	createConfig,
	regtest,
	keyPair,
} from "@midl-xyz/midl-js-core";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import * as bitcoin from "bitcoinjs-lib";
import { zeroAddress } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";
import { getKeyPair } from "~/__tests__/keyPair";
import { addTxIntention } from "~/actions/addTxIntention";
import { midlRegtest } from "~/config";
import type { TransactionIntention } from "~/types/intention";

describe("addTxIntention", () => {
	const config = createConfig({
		networks: [regtest],
		connectors: [keyPair({ keyPair: getKeyPair(bitcoin.networks.regtest) })],
	});

	const store = createStore<MidlContextState>()(() => ({
		intentions: [],
		wallet: {},
	}));

	beforeAll(() => {
		config.connectors[0].connect({ purposes: [AddressPurpose.Payment] });
	});

	it("adds a transaction intention", async () => {
		const txIntention: TransactionIntention = {
			evmTransaction: {
				from: zeroAddress,
				value: 0n,
				chainId: midlRegtest.id,
			},
		};

		await addTxIntention(config, store, txIntention);

		expect(store.getState().intentions).toEqual([txIntention]);
	});
});
