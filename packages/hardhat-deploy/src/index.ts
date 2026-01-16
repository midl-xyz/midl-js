import { extendEnvironment } from "hardhat/config";
import { createMidlHardhatEnvironment } from "~/createMidlHardhatEnvironment";
import "./tasks/address";
import "./type-extensions";

extendEnvironment((hre) => {
	hre.midl = createMidlHardhatEnvironment(hre);
});
