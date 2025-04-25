import { defineConfig, configDefaults } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "happy-dom",
		coverage: {
			exclude: [
				...configDefaults.exclude,
				"**/styled-system/**",
				"panda.config.ts",
				"postcss.config.cjs",
				"**/__tests__/**",
			],
		},
	},
});
