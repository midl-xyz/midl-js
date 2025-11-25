import { getAddress } from "viem";
import { getTransactionReceipt } from "viem/actions";
import { describe, expect, it } from "vitest";
import { useEnvironment } from "../tests/useEnvironment";

describe("MidlHardhatEnvironment", () => {
	useEnvironment();

	it("initializes with p2wpkh address", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize();

		expect(midl.getAccount().address).toBe(
			"bcrt1qz4yz7junaupmav0ycmwheglahya7wuy0g7n6tc",
		);
	});

	it("initializes with p2wpkh address, index 1", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize(1);

		expect(midl.getAccount().address).toBe(
			"bcrt1qldp99gjlh5qhj624qu9hg7cw3tztj0h6urds2z",
		);
	});

	it("changes account", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();

		const prevConfig = midl.getConfig();

		const prevAddress = midl.getEVMAddress();

		await midl.initialize(1);

		const newConfig = midl.getConfig();

		const newAddress = midl.getEVMAddress();

		expect(newConfig).not.toEqual(prevConfig);
		expect(prevAddress).not.toEqual(newAddress);
	});

	it.skip("return correct evm address", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();

		const evmAddress = midl.getEVMAddress();

		await midl.deploy("StructFunctionParam", { args: [] });
		await midl.execute();

		const deployment = await midl.getDeployment("StructFunctionParam");

		if (!deployment) {
			throw new Error("StructFunctionParam not found");
		}

		const receipt = await getTransactionReceipt(await midl.getWalletClient(), {
			hash: deployment.txId,
		});

		expect(getAddress(receipt.from)).toEqual(evmAddress);
	});
});
