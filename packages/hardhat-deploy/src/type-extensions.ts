import type { BitcoinNetwork } from "@midl-xyz/midl-js-core";
import "hardhat/types/config";
import "hardhat/types/runtime";
import type { MidlHardhatEnvironment } from "~/MidlHardhatEnvironment";

declare module "hardhat/types/config" {
	export interface HardhatUserConfig {
		midl: {
			mnemonic: string;
			path: string;
			confirmationsRequired?: number;
			btcConfirmationsRequired?: number;
			network?: string | BitcoinNetwork;
		};
	}
}

declare module "hardhat/types/runtime" {
	export interface HardhatRuntimeEnvironment {
		midl: MidlHardhatEnvironment;
	}
}
