import type {
	AbstractProvider,
	AbstractRunesProvider,
	Account,
	AddressPurpose,
	BitcoinNetwork,
	Config,
} from "@midl/core";
import "hardhat/types/config";
import "hardhat/types/runtime";
import type { createMidlHardhatEnvironment } from "~/createMidlHardhatEnvironment";

export type MidlNetworkConfig = {
	mnemonic: string;
	confirmationsRequired?: number;
	btcConfirmationsRequired?: number;
	network?: string | BitcoinNetwork;
	hardhatNetwork?: string;
	provider?: AbstractProvider;
	runesProvider?: AbstractRunesProvider;
	defaultPurpose?: AddressPurpose;
};

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
