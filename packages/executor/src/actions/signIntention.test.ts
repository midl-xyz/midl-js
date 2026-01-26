import {
	AddressPurpose,
	connect,
	disconnect,
	getDefaultAccount,
} from "@midl/core";
import {
	type PublicClient,
	keccak256,
	parseTransaction,
	recoverAddress,
	serializeTransaction,
} from "viem";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { midlConfig } from "~/__tests__/midlConfig";
import { signIntention } from "~/actions/signIntention";
import type { IntentionEVMTransaction, TransactionIntention } from "~/types";
import {
	getBIP322Hash,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
} from "~/utils";

describe("executor | actions | signIntention", () => {
	beforeEach(async () => {
		await connect(midlConfig, { purposes: [AddressPurpose.Payment] });
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("signs serialized intention end-to-end", async () => {
		const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);
		const client = { chain } as unknown as PublicClient;
		const evmTransaction: IntentionEVMTransaction = {
			to: "0x0000000000000000000000000000000000000001",
			value: 0n,
			chainId: chain.id,
		};

		const intention: TransactionIntention = { evmTransaction };
		const account = getDefaultAccount(midlConfig);

		const signed = await signIntention(
			midlConfig,
			client,
			intention,
			[intention],
			{ txId: "0xabc", nonce: 7 },
		);

		const tx = parseTransaction(signed);
		const { r, s, v, ...unsigned } = tx;

		if (!r || !s || !v) {
			throw new Error("Transaction is not signed");
		}

		const hashedMessage = getBIP322Hash(
			keccak256(serializeTransaction(unsigned)),
			account.addressType,
			account.publicKey,
		);

		const recoveredAddress = await recoverAddress({
			hash: hashedMessage,
			signature: { r, s, v },
		});

		expect(recoveredAddress).toEqual(
			getEVMAddress(account, midlConfig.getState().network),
		);
	});
});
