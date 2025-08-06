import * as bitcoin from "bitcoinjs-lib";
import { describe, expect, it, vi } from "vitest";
import { __TEST__MNEMONIC__ } from "~/__tests__/keyPair";
import { broadcastTransaction } from "~/actions/broadcastTransaction";
import { WalletConnectionError, connect } from "~/actions/connect";
import { getDefaultAccount } from "~/actions/getDefaultAccount";
import { signPSBT } from "~/actions/signPSBT";
import type { Account } from "~/connectors";
import { AddressPurpose, AddressType } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";

vi.mock("./broadcastTransaction", () => {
	return {
		broadcastTransaction: vi.fn().mockResolvedValue("txid"),
	};
});

describe("core | actions | signPSBT", async () => {
	const { keyPairConnector } = await import("@midl-xyz/midl-js-node");

	it("signs psbt with the connected wallet", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
				}),
			],
		});

		await connect(config, { purposes: [AddressPurpose.Payment] });

		const account = (await getDefaultAccount(config)) as Account;
		const psbt = new bitcoin.Psbt();

		const p2sh = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: Buffer.from(account.publicKey, "hex"),
				network: bitcoin.networks.regtest,
			}),
			network: bitcoin.networks.regtest,
		});

		psbt.addInput({
			hash: "e2d7f2123d9351f4f12a7cdb8b1d1aeb3e8d53d556cb6b564a3f2b093cf02fa3",
			index: 0,
			witnessUtxo: {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				script: p2sh.output!,
				value: 50000n, // Amount in satoshis
			},
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			redeemScript: p2sh.redeem!.output,
		});

		psbt.addOutput({
			script: Buffer.from(""),
			value: 0n,
		});

		const data = await signPSBT(config, {
			psbt: psbt.toBase64(),
			signInputs: {
				[account.address]: [0],
			},
		});

		expect(data.psbt).toBeDefined();
		expect(data.txId).toBeUndefined();
	});

	it("throws error if no connection", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		const psbt = new bitcoin.Psbt();

		await expect(
			signPSBT(config, { psbt: psbt.toBase64(), signInputs: {} }),
		).rejects.throws(WalletConnectionError);
	});

	it("publishes the transaction", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({
					mnemonic: __TEST__MNEMONIC__,
					paymentAddressType: AddressType.P2SH_P2WPKH,
				}),
			],
		});

		await connect(config, {
			purposes: [AddressPurpose.Payment],
		});

		const account = (await getDefaultAccount(config)) as Account;
		const psbt = new bitcoin.Psbt();

		const p2sh = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: Buffer.from(account.publicKey, "hex"),
				network: bitcoin.networks.regtest,
			}),
			network: bitcoin.networks.regtest,
		});

		psbt.addInput({
			hash: "e2d7f2123d9351f4f12a7cdb8b1d1aeb3e8d53d556cb6b564a3f2b093cf02fa3",
			index: 0,
			witnessUtxo: {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				script: p2sh.output!,
				value: 50000n, // Amount in satoshis
			},
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			redeemScript: p2sh.redeem!.output,
		});

		psbt.addOutput({
			script: Buffer.from(""),
			value: 0n,
		});

		const data = await signPSBT(config, {
			psbt: psbt.toBase64(),
			signInputs: {
				[account.address]: [0],
			},
			publish: true,
		});

		expect(data.psbt).toBeDefined();
		expect(data.txId).toBeDefined();

		expect(broadcastTransaction).toHaveBeenCalled();
	});
});
