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
});
