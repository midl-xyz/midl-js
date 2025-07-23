import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./vitest.setup.tsx"],
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
