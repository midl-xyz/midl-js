import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

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
