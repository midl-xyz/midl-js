import { Verifier } from "bip322-js";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { afterEach, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { SignMessageProtocol } from "~/actions";
import { keyPair as keyPairConnector } from "~/connectors/keyPair";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { extractXCoordinate } from "~/utils";

const key = getKeyPair();

describe("core | connectors | keyPair", () => {
	const midlConfig = createConfig({
		networks: [regtest],
		connectors: [
			keyPairConnector({
				keyPair: key,
			}),
		],
	});

	afterEach(async () => {
		await midlConfig.currentConnection?.disconnect?.();
	});

	it("should connect", async () => {
		const accounts = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
		});

		expect(accounts.length).toBe(2);
	});

	it("should connect with only one purpose", async () => {
		const accounts = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		expect(accounts.length).toBe(1);
	});

	it("should return correct network", async () => {
		await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		expect(await midlConfig.currentConnection?.getNetwork()).toBe(regtest);
	});

	it("should disconnect", async () => {
		await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		await midlConfig.currentConnection?.disconnect?.();

		expect(midlConfig.getState().connection).toBeUndefined();
	});

	it("should get accounts", async () => {
		await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		const accounts = await midlConfig.currentConnection?.getAccounts();

		expect(accounts?.length).toBe(1);
	});

	it("should sign message bip322", async () => {
		const [account] = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		const message =
			"0xb02f644ad56fa52256c134bbf763955d57da14c25effe3e0371e582f131ddb55";

		const signature = await midlConfig.currentConnection?.signMessage({
			message,
			address: account.address,
			protocol: SignMessageProtocol.Bip322,
		});

		const valid = Verifier.verifySignature(
			account.address,
			message,
			// biome-ignore lint/style/noNonNullAssertion: signature is defined
			signature!.signature,
		);

		expect(valid).toBeTruthy();
	});

	it("should sign message ecdsa", async () => {
		const [account] = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Payment],
		});

		const signature = await midlConfig.currentConnection?.signMessage({
			message: "test message",
			address: account.address,
			protocol: SignMessageProtocol.Ecdsa,
		});

		const valid = bitcoinMessage.verify(
			"test message",
			account.address,
			// biome-ignore lint/style/noNonNullAssertion: signature is defined
			Buffer.from(signature!.signature, "base64"),
		);

		expect(valid).toBeTruthy();
	});

	it.skip("should sign psbt payment", async () => {
		const [account] = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Payment],
		});

		const psbt = new Psbt();

		const p2sh = bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({
				pubkey: key.publicKey,
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

		const psbtData = psbt.toBase64();

		const signedPsbt = await midlConfig.currentConnection?.signPSBT({
			psbt: psbtData,
			signInputs: {
				[account.address]: [0],
			},
		});

		if (!signedPsbt) {
			throw new Error("Invalid response");
		}

		expect(
			Psbt.fromBase64(signedPsbt.psbt).data.inputs[0].finalScriptWitness,
		).toBeDefined();
	});

	it.skip("should sign psbt ordinals", async () => {
		const [account] = await midlConfig.connectors[0].connect({
			purposes: [AddressPurpose.Ordinals],
		});

		const psbt = new Psbt();

		const xOnly = Buffer.from(
			extractXCoordinate(key.publicKey.toString("hex")),
			"hex",
		);

		const p2tr = bitcoin.payments.p2tr({
			internalPubkey: xOnly,
			network: bitcoin.networks.regtest,
		});

		psbt.addInput({
			hash: "e2d7f2123d9351f4f12a7cdb8b1d1aeb3e8d53d556cb6b564a3f2b093cf02fa3",
			index: 0,
			witnessUtxo: {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				script: p2tr.output!,
				value: 50000n, // Amount in satoshis
			},
			tapInternalKey: xOnly,
		});

		psbt.addOutput({
			script: Buffer.from(""),
			value: 0n,
		});

		const psbtData = psbt.toBase64();

		const signedPsbt = await midlConfig.currentConnection?.signPSBT({
			psbt: psbtData,
			signInputs: {
				[account.address]: [0],
			},
		});

		if (!signedPsbt) {
			throw new Error("Invalid response");
		}

		expect(
			Psbt.fromBase64(signedPsbt.psbt).data.inputs[0].finalScriptWitness,
		).toBeDefined();
	});
});
