import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import sand from "@park-ui/panda-preset/colors/sand";
import postcss from "postcss";
const prefixKeyframes = require("./plugins/postcss-prefix-keyframes.cjs");
const removeStyles = require("./plugins/postcss-remove-global-resets.cjs");
const prefixGlobals = require("./plugins/postcss-prefix-globals.cjs");

import { textStyles } from "./src/theme";

export default defineConfig({
	preflight: true,
	prefix: "satoshi-kit-",
	jsxFramework: "react",
	presets: [
		createPreset({ accentColor: amber, grayColor: sand, radius: "sm" }),
	],
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	theme: {
		extend: {
			textStyles,
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
