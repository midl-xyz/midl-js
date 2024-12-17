import type { Environment } from "vitest/environments";
import { builtinEnvironments } from "vitest/environments";

export default (<Environment>{
	...builtinEnvironments.jsdom,
	async setupVM(options) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const node = await builtinEnvironments.jsdom.setupVM!(options);

		return {
			getVmContext() {
				return {
					...node.getVmContext(),
					Buffer,
					ArrayBuffer,
					Uint8Array,
					TextEncoder,
				};
			},
			teardown(...args) {
				return node.teardown(...args);
			},
			// // biome-ignore lint/style/noNonNullAssertion: <explanation>

			// context: {
			//     // biome-ignore lint/style/noNonNullAssertion: <explanation>
			//     ...builtinEnvironments.jsdom.setupVM!(options)!.getVmContext(),
			//     Buffer,
			//     ArrayBuffer,
			//     Uint8Array,
			//     TextEncoder,
			// },
		};
	},
	setup: async (global, options) => {
		const jsdomEnv = await builtinEnvironments.jsdom.setup(global, options);

		global.Buffer = Buffer;
		global.ArrayBuffer = ArrayBuffer;
		global.Uint8Array = Uint8Array;

		global.TextEncoder = TextEncoder;

		return {
			teardown: async (...args) => {
				await jsdomEnv.teardown(...args);
			},
		};
	},
});
