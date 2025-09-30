import {
	type Account,
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
	mainnet,
	regtest,
	signet,
	testnet,
	testnet4,
} from "@midl/core";
import {
	AddressPurpose,
	BitcoinNetworkType,
	MessageSigningProtocols,
	request,
} from "sats-connect";

export class SatsConnectConnector implements Connector {
	public readonly id: string;

	constructor(public readonly providerId?: string) {
		this.id = `sats-connect-${providerId ?? "default"}`;
	}

	async connect({ purposes, network }: ConnectorConnectParams) {
		const data = await request(
			"wallet_connect",
			{
				addresses: purposes,
			},
			this.providerId,
		);

		if (data.status === "error") {
			throw data.error;
		}

		const accounts = data.result.addresses
			.filter((it) =>
				[AddressPurpose.Ordinals, AddressPurpose.Payment].includes(it.purpose),
			)
			.map(({ walletType, ...account }) => {
				return {
					...account,
					purpose: getAddressPurpose(account.address, network),
					addressType: getAddressType(account.address),
				};
			})
			.filter((it) => purposes.includes(it.purpose)) as Account[];

		return accounts;
	}

	async beforeDisconnect() {
		await request("wallet_renouncePermissions", undefined, this.providerId);
	}

	async signMessage({
		address,
		message,
		protocol = SignMessageProtocol.Bip322,
	}: SignMessageParams): Promise<SignMessageResponse> {
		const response = await request(
			"signMessage",
			{
				address,
				message,
				protocol:
					protocol === SignMessageProtocol.Ecdsa
						? MessageSigningProtocols.ECDSA
						: MessageSigningProtocols.BIP322,
			},
			this.providerId,
		);

		if (response.status === "error") {
			throw response.error;
		}

		return {
			signature: response.result.signature,
			address: response.result.address,
			protocol,
		};
	}

	async signPSBT({
		psbt,
		signInputs,
	}: SignPSBTParams): Promise<SignPSBTResponse> {
		const response = await request(
			"signPsbt",
			{
				psbt: psbt,
				signInputs,
			},
			this.providerId,
		);

		if (response.status === "error") {
			throw response.error;
		}

		return {
			psbt: response.result.psbt,
		};
	}

	async switchNetwork(network: BitcoinNetwork) {
		let networkName: BitcoinNetworkType;

		switch (network) {
			case mainnet: {
				networkName = BitcoinNetworkType.Mainnet;
				break;
			}

			case testnet4: {
				networkName = BitcoinNetworkType.Testnet4;
				break;
			}

			case testnet: {
				networkName = BitcoinNetworkType.Testnet;
				break;
			}

			case regtest: {
				networkName = BitcoinNetworkType.Regtest;
				break;
			}

			case signet: {
				networkName = BitcoinNetworkType.Signet;
				break;
			}

			default: {
				throw new Error(`Network ${network} is not supported`);
			}
		}

		const data = await request(
			"wallet_changeNetwork",
			{
				name: networkName,
			},
			this.providerId,
		);

		if (data.status === "error") {
			throw data.error;
		}

		return this.getAccounts({ network });
	}

	async getAccounts({
		network,
	}: {
		network: BitcoinNetwork;
	}) {
		const data = await request("wallet_getAccount", null, this.providerId);

		if (data.status === "error") {
			throw data.error;
		}

		const accounts = data.result.addresses.map(({ walletType, ...account }) => {
			return {
				...account,
				purpose: getAddressPurpose(account.address, network),
				addressType: getAddressType(account.address),
			};
		}) as Account[];

		return accounts;
	}
}
