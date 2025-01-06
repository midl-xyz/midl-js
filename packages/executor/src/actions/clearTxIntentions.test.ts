import { AddressPurpose, createConfig, regtest } from "@midl-xyz/midl-js-core";
import { keyPair } from "@midl-xyz/midl-js-core/dist/connectors/keyPair";
import type { MidlContextState } from "@midl-xyz/midl-js-react";
import * as bitcoin from "bitcoinjs-lib";
import { zeroAddress } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";
import { getKeyPair } from "~/__tests__/keyPair";
import { addTxIntention } from "~/actions/addTxIntention";
import { clearTxIntentions } from "~/actions/clearTxIntentions";
import { midlRegtest } from "~/config";
import type { TransactionIntention } from "~/types/intention";

describe("clearTxIntentions", () => {
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

	it("clears transaction intentions", async () => {
		const txIntention: TransactionIntention = {
			evmTransaction: {
				from: zeroAddress,
				value: 0n,
				chainId: midlRegtest.id,
			},
		};

		await addTxIntention(config, store, txIntention);

		clearTxIntentions(store);

		expect(store.getState().intentions).toEqual([]);
	});
});
