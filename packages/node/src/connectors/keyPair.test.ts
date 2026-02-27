import { Verifier } from "@midl/bip322-js";
import {
	AddressPurpose,
	connect,
	createConfig,
	disconnect,
	extractXCoordinate,
	regtest,
	SignMessageProtocol,
} from "@midl/core";
import * as bitcoin from "bitcoinjs-lib";
import { Psbt } from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import { afterEach, describe, expect, it } from "vitest";
import {
	__TEST__MNEMONIC__,
	__TEST__PRIVATE_KEY_HEX__,
	__TEST__PRIVATE_KEY_WIF__,
} from "~/__tests__/keyPair";
import { keyPairConnector } from "~/connectors/keyPair";

describe("core | connectors | keyPair", () => {
	const midlConfig = createConfig({
		networks: [regtest],
		connectors: [keyPairConnector({ mnemonic: __TEST__MNEMONIC__ })],
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
				pubkey: Buffer.from(account.publicKey, "hex"),
				network: bitcoin.networks.regtest,
			}),
			network: bitcoin.networks.regtest,
		});

		psbt.addInput({
			hash: "e2d7f2123d9351f4f12a7cdb8b1d1aeb3e8d53d556cb6b564a3f2b093cf02fa3",
			index: 0,
			witnessUtxo: {
				// biome-ignore lint/style/noNonNullAssertion: this is intentional
				script: p2sh.output!,
				value: 50000n, // Amount in satoshis
			},
			// biome-ignore lint/style/noNonNullAssertion: this is intentional
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

		const xOnly = Buffer.from(extractXCoordinate(account.publicKey), "hex");

		const p2tr = bitcoin.payments.p2tr({
			internalPubkey: xOnly,
			network: bitcoin.networks.regtest,
		});

		psbt.addInput({
			hash: "e2d7f2123d9351f4f12a7cdb8b1d1aeb3e8d53d556cb6b564a3f2b093cf02fa3",
			index: 0,
			witnessUtxo: {
				// biome-ignore lint/style/noNonNullAssertion: this is intentional
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

	describe("with hex private key", () => {
		const hexConfig = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({ privateKeys: [__TEST__PRIVATE_KEY_HEX__] }),
			],
		});

		afterEach(async () => {
			await disconnect(hexConfig);
		});

		it("should connect with hex private key", async () => {
			const accounts = await connect(hexConfig, {
				purposes: [AddressPurpose.Payment],
			});

			expect(accounts.length).toBe(1);
			expect(accounts[0].address).toBeDefined();
			expect(accounts[0].publicKey).toBeDefined();
		});

		it("should sign message with hex private key", async () => {
			const [account] = await connect(hexConfig, {
				purposes: [AddressPurpose.Payment],
			});

			const { connection, network } = hexConfig.getState();

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
	});

	describe("with WIF private key", () => {
		const wifConfig = createConfig({
			networks: [regtest],
			connectors: [
				keyPairConnector({ privateKeys: [__TEST__PRIVATE_KEY_WIF__] }),
			],
		});

		afterEach(async () => {
			await disconnect(wifConfig);
		});

		it("should connect with WIF private key", async () => {
			const accounts = await connect(wifConfig, {
				purposes: [AddressPurpose.Payment],
			});

			expect(accounts.length).toBe(1);
			expect(accounts[0].address).toBeDefined();
			expect(accounts[0].publicKey).toBeDefined();
		});

		it("should sign message with WIF private key", async () => {
			const [account] = await connect(wifConfig, {
				purposes: [AddressPurpose.Payment],
			});

			const { connection, network } = wifConfig.getState();

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
	});

	describe("parameter validation", () => {
		it("should throw error when neither mnemonic nor privateKeys is provided", () => {
			expect(() => {
				// @ts-expect-error - Testing invalid parameters
				keyPairConnector({});
			}).toThrow("Invalid parameters for KeyPairConnector");
		});

		it("should handle hex private key with 0x prefix", async () => {
			const hexWithPrefix = `0x${__TEST__PRIVATE_KEY_HEX__}`;
			const config = createConfig({
				networks: [regtest],
				connectors: [keyPairConnector({ privateKeys: [hexWithPrefix] })],
			});

			const accounts = await connect(config, {
				purposes: [AddressPurpose.Payment],
			});

			expect(accounts.length).toBe(1);
			expect(accounts[0].address).toBeDefined();

			await disconnect(config);
		});

		it("should handle multiple private keys with different account indices", async () => {
			const config1 = createConfig({
				networks: [regtest],
				connectors: [
					keyPairConnector({
						privateKeys: [
							__TEST__PRIVATE_KEY_WIF__,
							"cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f",
						],
						accountIndex: 0,
					}),
				],
			});

			const config2 = createConfig({
				networks: [regtest],
				connectors: [
					keyPairConnector({
						privateKeys: [
							__TEST__PRIVATE_KEY_WIF__,
							"cSBTc78h1Ab9MNcQcFD8w3kNTW8xWM4EjTQgKLDq9gUG9GrRZD3f",
						],
						accountIndex: 1,
					}),
				],
			});

			const accounts1 = await connect(config1, {
				purposes: [AddressPurpose.Payment],
			});

			const accounts2 = await connect(config2, {
				purposes: [AddressPurpose.Payment],
			});

			// Addresses should be different for different account indices
			expect(accounts1[0].address).not.toBe(accounts2[0].address);

			await disconnect(config1);
			await disconnect(config2);
		});
	});
});
