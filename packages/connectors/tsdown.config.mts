import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/**/index.ts"],
	unbundle: true,
	dts: true,
	treeshake: true,
	external: [/^node:/, /node_modules/],
	format: {
		esm: {
			target: ["nodenext"],
		},
		cjs: {
			target: ["esnext"],
		},
	},
});
