import type { AbstractProvider, BitcoinNetwork } from "@midl-xyz/midl-js-core";
import type { Chain } from "@midl-xyz/midl-js-executor";
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
					derivationPath?: "xverse" | "leather" | string;
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
