import {
	AddressPurpose,
	AddressType,
	type BitcoinNetwork,
	connect,
	createConfig,
} from "@midl/core";
import { keyPairConnector } from "@midl/node";
import type { StoreApi } from "zustand/vanilla";
import type { MidlHardhatStore } from "~/actions/createStore";
import type { MidlNetworkConfig } from "~/type-extensions";

export const setup = async (
	userConfig: MidlNetworkConfig,
	store: StoreApi<MidlHardhatStore>,
	{
		bitcoinNetwork,
		accountIndex = 0,
	}: {
		bitcoinNetwork: BitcoinNetwork;
		accountIndex?: number;
	},
) => {
	const midlConfig = createConfig({
		networks: [bitcoinNetwork],
		connectors: [
			keyPairConnector({
				mnemonic: userConfig.mnemonic,
				paymentAddressType: AddressType.P2WPKH,
				accountIndex,
			}),
		],
		defaultPurpose: userConfig.defaultPurpose,
		runesProvider: userConfig.runesProviderFactory
			? userConfig.runesProviderFactory()
			: undefined,
		provider: userConfig.providerFactory
			? userConfig.providerFactory()
			: undefined,
	});

	await connect(midlConfig, {
		purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
	});

	store.setState({
		intentions: [],
	});

	return midlConfig;
};
