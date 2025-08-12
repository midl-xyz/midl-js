import { describe, expect, it } from "vitest";
import { NetworkError, switchNetwork } from "~/actions/switchNetwork";
import { createConfig } from "~/createConfig";
import { mainnet, regtest } from "~/networks";

describe("core | actions | switchNetwork", () => {
	it("switches network", async () => {
		const config = createConfig({
			networks: [regtest, mainnet],
			connectors: [],
		});

		await switchNetwork(config, mainnet);

		expect(config.getState().network).toBe(mainnet);
	});

	it("throws if network isn't in the list", async () => {
		const config = createConfig({
			networks: [regtest],
			connectors: [],
		});

		await expect(switchNetwork(config, mainnet)).rejects.throws(NetworkError);
	});
});
