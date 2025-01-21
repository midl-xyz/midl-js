import { describe, it } from "vitest";
import { useEnvironment } from "../tests/useEnvironment";

describe("MidlHardhatEnvironment", () => {
	useEnvironment();

	it("works", async () => {
		const { hre } = globalThis;

		await hre.midl.initialize();
		const deployer = await hre.midl.getAddress();

		await hre.midl.deploy("UniswapV2Factory", {
			args: [deployer, "0x677ebf28ab1Ca164F5d86313359EEcbEe54fF22b"],
		});

		await hre.midl.execute();
	});
});
