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
import { signIntentions } from "~/actions/signIntentions";
import type { IntentionEVMTransaction, TransactionIntention } from "~/types";
import {
	getBIP322Hash,
	getEVMAddress,
	getEVMFromBitcoinNetwork,
} from "~/utils";

describe("executor | actions | signIntentions", () => {
	beforeEach(async () => {
		await connect(midlConfig, { purposes: [AddressPurpose.Payment] });
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("signs multiple intentions end-to-end", async () => {
		const chain = getEVMFromBitcoinNetwork(midlConfig.getState().network);
		const client = { chain } as unknown as PublicClient;
		const account = getDefaultAccount(midlConfig);

		const firstTx: IntentionEVMTransaction = {
			to: "0x0000000000000000000000000000000000000001",
			value: 0n,
			chainId: chain.id,
		} as IntentionEVMTransaction;
		const secondTx: IntentionEVMTransaction = {
			to: "0x0000000000000000000000000000000000000002",
			value: 0n,
			chainId: chain.id,
		} as IntentionEVMTransaction;
		const intentions: TransactionIntention[] = [
			{ evmTransaction: firstTx },
			{ evmTransaction: secondTx },
		];

		const signed = await signIntentions(midlConfig, client, intentions, {
			txId: "0xabc",
			nonce: 12,
		});

		for (const signedTx of signed) {
			const tx = parseTransaction(signedTx);
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
		}
	});
});
