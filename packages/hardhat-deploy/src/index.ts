import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { MidlHardhatEnvironment } from "~/MidlHardhatEnvironment";
import "./type-extensions";

extendEnvironment((hre) => {
	hre.midl = lazyObject(() => new MidlHardhatEnvironment(hre));
});
