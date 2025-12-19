import type {
	AbstractProvider,
	AbstractRunesProvider,
	AddressPurpose,
	BitcoinNetwork,
} from "@midl/core";
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
					provider?: AbstractProvider | (() => AbstractProvider);
					runesProvider?: AbstractRunesProvider | (() => AbstractRunesProvider);
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
