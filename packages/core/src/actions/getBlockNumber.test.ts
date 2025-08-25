import { describe, expect, it } from "vitest";
import { createConfig } from "~/createConfig";
import { mainnet, regtest, testnet4 } from "~/networks";
import { getBlockNumber } from "./getBlockNumber";

describe("core | actions | getBlockNumber", () => {
	it("returns the correct mainnet block number", async () => {
		const config = createConfig({
			networks: [mainnet],
			connectors: [],
		});
		const url = "https://mempool.space/api/blocks/tip/height";
		const response = await fetch(url);

		expect(await getBlockNumber(config)).toEqual(
			Number.parseInt(await response.text(), 10),
		);
	});

	it("returns the correct testnet block number", async () => {
		const config = createConfig({
			networks: [testnet4],
			connectors: [],
		});

		const url = "https://mempool.space/testnet4/api/blocks/tip/height";
		const response = await fetch(url);

		expect(await getBlockNumber(config)).toEqual(
			Number.parseInt(await response.text(), 10),
		);
	});

	it("returns the correct regtest block number", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		const url = "https://mempool.regtest.midl.xyz/api/blocks/tip/height";
		const response = await fetch(url);
		expect(await getBlockNumber(config)).toEqual(
			Number.parseInt(await response.text(), 10),
		);
	});
});
