import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		tsconfigPaths({
			loose: true,
		}),
	],
	test: {
		environment: "happy-dom",
		alias: {
			"~/": new URL("./src/", import.meta.url).pathname,
		},
	},
});
