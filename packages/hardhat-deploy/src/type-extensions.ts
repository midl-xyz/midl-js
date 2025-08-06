import type {
	AbstractProvider,
	AddressPurpose,
	BitcoinNetwork,
} from "@midl-xyz/midl-js-core";
import "hardhat/types/config";
import "hardhat/types/runtime";
import type { MidlHardhatEnvironment } from "~/MidlHardhatEnvironment";

declare module "hardhat/types/config" {
	export interface HardhatUserConfig {
		midl: {
			path?: string;
			networks: Record<
				string | "default",
				{
					mnemonic: string;
					confirmationsRequired?: number;
					btcConfirmationsRequired?: number;
					network?: string | BitcoinNetwork;
					hardhatNetwork?: string;
					provider?: AbstractProvider;
					defaultPurpose?: AddressPurpose;
				}
			>;
		};
	}
}

declare module "hardhat/types/runtime" {
	export interface HardhatRuntimeEnvironment {
		midl: MidlHardhatEnvironment;
	}
}
