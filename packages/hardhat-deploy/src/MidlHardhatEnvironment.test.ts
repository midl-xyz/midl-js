import { describe, it } from "vitest";
import { useEnvironment } from "../tests/useEnvironment";

describe("MidlHardhatEnvironment", () => {
	useEnvironment();

	it("works", async () => {
		const { hre } = globalThis;

		await hre.midl.initialize();
		const deployer = hre.midl.wallet.getEVMAddress();

		await hre.midl.deploy("UniswapV2Factory", {
			args: [deployer, "0x677ebf28ab1Ca164F5d86313359EEcbEe54fF22b"],
		});

		await hre.midl.execute();
	});

	it("creates deployContract intention", async () => {
		const { hre } = globalThis;

		await hre.midl.initialize();

		await hre.midl.deploy("UniswapV2Factory");

		await hre.midl.execute();
	});

	it("creates callContract intention", async () => {
		const { hre } = globalThis;

		await hre.midl.initialize();
		const deployer = hre.midl.wallet.getEVMAddress();

		await hre.midl.callContract("UniswapV2Factory", "createPair", {
			args: [deployer, "0x677ebf28ab1Ca164F5d86313359EEcbEe54fF22b"],
		});

		await hre.midl.execute();
	});
});
