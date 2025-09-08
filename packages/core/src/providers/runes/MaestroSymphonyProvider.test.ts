import { run } from "node:test";
import { describe, expect, it } from "vitest";
import { regtest } from "~/networks";
import { MaestroSymphonyProvider } from "~/providers/runes/MaestroSymphonyProvider";

describe("MaestroSymphonyProvider", () => {
	it.skip("gets rune", async () => {
		const provider = new MaestroSymphonyProvider();

		const rune = provider.getRune(regtest, "11893:1");

		expect(rune).resolves.toEqual({
			id: "11893:1",
		});
	});
});
