import { regtest } from "@midl-xyz/midl-js-core";
import { describe, expect, it } from "vitest";
import { createMidlConfig } from "~/app/createMidlConfig";

describe("createMidlConfig", () => {
	it("allows overriding connectors", () => {
		const config = createMidlConfig({
			networks: [regtest],
			connectors: [],
		});

		expect(config.getInitialState().connectors).toEqual([]);
	});
});
