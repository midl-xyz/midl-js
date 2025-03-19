import { Verifier } from "bip322-js";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { afterEach, describe, expect, it } from "vitest";
import { getKeyPair } from "~/__tests__/keyPair";
import { connect, disconnect, SignMessageProtocol } from "~/actions";
import { KeyPairConnector } from "~/connectors/keyPair";
import { AddressPurpose } from "~/constants";
import { createConfig } from "~/createConfig";
import { regtest } from "~/networks";
import { extractXCoordinate } from "~/utils";

const key = getKeyPair();

describe("core | connectors | keyPair", () => {
	const midlConfig = createConfig({
		networks: [regtest],
		connectors: [new KeyPairConnector(key)],
	});

	afterEach(async () => {
		await disconnect(midlConfig);
	});

	it("should connect", async () => {
		const accounts = await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
		});

		expect(accounts.length).toBe(2);
	});

	it("should connect with only one purpose", async () => {
		const accounts = await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		expect(accounts.length).toBe(1);
	});

	it("should return correct network", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		expect(await midlConfig.getState().network).toBe(regtest);
	});

	it("should disconnect", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		await disconnect(midlConfig);

		expect(midlConfig.getState().connection).toBeUndefined();
	});

	it("should get accounts", async () => {
		await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const { accounts } = midlConfig.getState();

		expect(accounts?.length).toBe(1);
	});

	it("should sign message bip322", async () => {
		const [account] = await connect(midlConfig, {
			purposes: [AddressPurpose.Ordinals],
		});

		const message =
			"0xb02f644ad56fa52256c134bbf763955d57da14c25effe3e0371e582f131ddb55";

		const { connection, network } = midlConfig.getState();

		const signature = await connection?.signMessage(
			{
				message,
				address: account.address,
				protocol: SignMessageProtocol.Bip322,
			},
			network,
		);

		const valid = Verifier.verifySignature(
			account.address,
			message,
			// biome-ignore lint/style/noNonNullAssertion: signature is defined
			signature!.signature,
		);

		expect(valid).toBeTruthy();
	});

	it("should sign message ecdsa", async () => {
		const [account] = await connect(midlConfig, {
			purposes: [AddressPurpose.Payment],
		});

		const { connection, network } = midlConfig.getState();

		const signature = await connection?.signMessage(
			{
				message: "test message",
				address: account.address,
				protocol: SignMessageProtocol.Ecdsa,
			},
			network,
		);

		const valid = bitcoinMessage.verify(
			"test message",
			account.address,
			// biome-ignore lint/style/noNonNullAssertion: signature is defined
			Buffer.from(signature!.signature, "base64"),
		);

		expect(valid).toBeTruthy();
	});

	it.skip("should sign psbt payment", async () => {
		const [account] = await connect(midlConfig, {
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

		const { connection, network } = midlConfig.getState();

		const signedPsbt = await connection?.signPSBT(
			{
				psbt: psbtData,
				signInputs: {
					[account.address]: [0],
				},
			},
			network,
		);

		if (!signedPsbt) {
			throw new Error("Invalid response");
		}

		expect(
			Psbt.fromBase64(signedPsbt.psbt).data.inputs[0].finalScriptWitness,
		).toBeDefined();
	});

	it.skip("should sign psbt ordinals", async () => {
		const [account] = await connect(midlConfig, {
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

		const { connection, network } = midlConfig.getState();

		const signedPsbt = await connection?.signPSBT(
			{
				psbt: psbtData,
				signInputs: {
					[account.address]: [0],
				},
			},
			network,
		);

		if (!signedPsbt) {
			throw new Error("Invalid response");
		}

		expect(
			Psbt.fromBase64(signedPsbt.psbt).data.inputs[0].finalScriptWitness,
		).toBeDefined();
	});
});
