import { describe, it } from "vitest";
import { useEnvironment } from "../../../tests/useEnvironment";

const isE2ETest = Boolean(process.env.E2E);

describe.runIf(isE2ETest)("Foo", async () => {
	useEnvironment();

	it("deploys Foo contract", async () => {
		const {
			hre: { midl },
		} = globalThis;

		await midl.initialize();
		await midl.deploy("Foo");
		await midl.execute();
	});
});
