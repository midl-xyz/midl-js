import type {
	AbstractProvider,
	AbstractRunesProvider,
	AddressPurpose,
	AddressType,
	BitcoinNetwork,
	Connector,
	ConnectorWithMetadata,
} from "@midl/core";
import "hardhat/types/config";
import "hardhat/types/runtime";
import type { createMidlHardhatEnvironment } from "~/createMidlHardhatEnvironment";

type MidlCommonConfig = {
	paymentAddressType?: AddressType;
	confirmationsRequired?: number;
	btcConfirmationsRequired?: number;
	network?: string | BitcoinNetwork;
	hardhatNetwork?: string;
	defaultPurpose?: AddressPurpose;
	runesProviderFactory?: () => AbstractRunesProvider;
	providerFactory?: () => AbstractProvider;
};

type MidlPrivateKeyConfig = {
	privateKeys: string[];
};

type MidlMnemonicConfig = {
	mnemonic: string;
};

type MidlConnectorConfig = {
	connectorFactory: ({
		accountIndex,
		paymentAddressType,
	}: {
		accountIndex?: number;
		paymentAddressType?: AddressType;
	}) => ConnectorWithMetadata<Connector>;
};

export type MidlNetworkConfig = MidlCommonConfig &
	(MidlPrivateKeyConfig | MidlMnemonicConfig | MidlConnectorConfig);

declare module "hardhat/types/config" {
	export interface HardhatUserConfig {
		midl: {
			path?: string;
			networks: Record<string | "default", MidlNetworkConfig>;
		};
	}
}

declare module "hardhat/types/runtime" {
	export interface HardhatRuntimeEnvironment {
		midl: ReturnType<typeof createMidlHardhatEnvironment>;
	}
}
