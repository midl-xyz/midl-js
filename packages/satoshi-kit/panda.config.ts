import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@pandacss/dev";
import postcss from "postcss";
import prefixGlobals from "./plugins/postcss-prefix-globals.cjs";
import prefixKeyframes from "./plugins/postcss-prefix-keyframes.cjs";
import removeStyles from "./plugins/postcss-remove-global-resets.cjs";
import { conditions, keyframes, textStyles } from "./src/theme";
import * as recipes from "./src/theme/recipes";
import * as semanticTokens from "./src/theme/semantic-tokens";
import * as tokens from "./src/theme/tokens";

export default defineConfig({
	preflight: true,
	prefix: "satoshi-kit-",
	jsxFramework: "react",
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	conditions,
	theme: {
		extend: {
			keyframes,
			tokens,
			textStyles,
			semanticTokens,
			recipes,
		},
	},

	hooks: {
		"codegen:done": () => {
			const styledSystemDir = join(__dirname, "styled-system");
			const folders = ["css", "jsx", "recipes", "tokens", "patterns"];
			const contents = 'export * from "./index.mjs";\n';

			for (const folder of folders) {
				const dir = join(styledSystemDir, folder);
				mkdirSync(dir, { recursive: true });
				writeFileSync(join(dir, "index.js"), contents, "utf8");
			}

			const helpersMjs = join(styledSystemDir, "helpers.js");
			const helpersContent = 'export * from "./index.mjs";\n';
			writeFileSync(helpersMjs, helpersContent, "utf8");
		},
		"cssgen:done": ({ artifact, content }) => {
			if (artifact === "styles.css") {
				const result = postcss([
					prefixKeyframes({ prefix: "satoshi-kit--" }),
					removeStyles(),
					prefixGlobals(),
				]).process(content);

				console.log(`PostCSS processing completed for ${artifact}`);

				return result.css;
			}

			console.log(`Skipping postcss processing for ${artifact}`);

			return content;
		},
	},
	outdir: "styled-system",
	importMap: {
		css: "@midl/satoshi-kit/styled-system/css",
		recipes: "@midl/satoshi-kit/styled-system/recipes",
		patterns: "@midl/satoshi-kit/styled-system/patterns",
		jsx: "@midl/satoshi-kit/styled-system/jsx",
	},
});
