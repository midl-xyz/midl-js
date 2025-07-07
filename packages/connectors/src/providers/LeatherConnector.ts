import {
	type Account,
	AddressType,
	type BitcoinNetwork,
	type Connector,
	type ConnectorConnectParams,
	type SignMessageParams,
	SignMessageProtocol,
	type SignMessageResponse,
	type SignPSBTParams,
	type SignPSBTResponse,
	getAddressPurpose,
	getAddressType,
} from "@midl-xyz/midl-js-core";
import { Psbt, networks } from "bitcoinjs-lib";

export class LeatherConnector implements Connector {
	public readonly id = "leather";

	async connect(params: ConnectorConnectParams): Promise<Account[]> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		const response = await window.LeatherProvider.request("getAddresses");

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		const { purposes, network } = params;

		const accounts = response.result.addresses
			.filter((it) => it.symbol === "BTC")
			.map((it) => {
				return {
					address: it.address,
					publicKey: it.publicKey,
					purpose: getAddressPurpose(it.address, network),
					addressType: getAddressType(it.address),
				};
			})
			.filter((it) => purposes.includes(it.purpose));

		if (purposes.length > 0) {
			const missingPurpose = purposes.find((purpose) => {
				return !accounts.find((account) => account.purpose === purpose);
			});

			if (missingPurpose) {
				throw new Error(`Missing purpose: ${missingPurpose}`);
			}
		}

		return accounts;
	}

	private getNetworkName(network: BitcoinNetwork) {
		switch (network.network) {
			case "bitcoin":
				return "mainnet";
			case "regtest":
				return "devnet";

			default:
				return network.network;
		}
	}

	async signMessage(
		params: SignMessageParams,
		network: BitcoinNetwork,
	): Promise<SignMessageResponse> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		if (params.protocol === SignMessageProtocol.Ecdsa) {
			throw new Error("Invalid protocol");
		}

		const response = await window.LeatherProvider.request("signMessage", {
			message: params.message,
			network: this.getNetworkName(network),
			paymentType:
				getAddressType(params.address) === AddressType.P2TR ? "p2tr" : "p2wpkh",
		});

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		return {
			...response.result,
			protocol: SignMessageProtocol.Bip322,
		};
	}

	async signPSBT(
		{ psbt, signInputs }: SignPSBTParams,
		network: BitcoinNetwork,
	): Promise<SignPSBTResponse> {
		if (typeof window.LeatherProvider === "undefined") {
			throw new Error("LeatherProvider not found");
		}

		const toSignInputs = Object.keys(signInputs).flatMap((address) => {
			return signInputs[address].map((inputIndex) => {
				return inputIndex;
			});
		});

		const bitcoinNetwork = networks[network.network];

		const response = await window.LeatherProvider.request("signPsbt", {
			hex: Psbt.fromBase64(psbt, {
				network: bitcoinNetwork,
			}).toHex(),
			signInputs: toSignInputs,
			network: this.getNetworkName(network),
			broadcast: false,
		});

		if (!("result" in response)) {
			throw new Error("Invalid response");
		}

		const base64Psbt = Psbt.fromHex(response.result.hex, {
			network: bitcoinNetwork,
		}).toBase64();

		return {
			psbt: base64Psbt,
		};
	}
}
