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
			"bcrt1qquv9lg5g2r4jkr0ahun0ddfg5xntxjelwjpnuw",
		);
	});

	it("initializes with p2wpkh address, index 1", async () => {
		const {
			hre: { midl },
		} = globalThis;
		await midl.initialize(1);

		expect(midl.getAccount().address).toBe(
			"bcrt1qddd479298yf4mtzdxwudkd7npj7ln3s5g9awk3",
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
});
