import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { MidlHardhatEnvironment } from "~/MidlHardhatEnvironment";
import "./type-extensions";
import "./tasks/address";

extendEnvironment((hre) => {
	hre.midl = lazyObject(() => new MidlHardhatEnvironment(hre));
});
