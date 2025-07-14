const prefixKeyframes = require("./plugins/postcss-prefix-keyframes.cjs");
const removeStyles = require("./plugins/postcss-remove-global-resets.cjs");
const prefixGlobals = require("./plugins/postcss-prefix-globals.cjs");

module.exports = {
	plugins: [
		require("@pandacss/dev/postcss"),
		prefixKeyframes({ prefix: "satoshi-kit--" }),
		removeStyles(),
		prefixGlobals(),
	],
};
