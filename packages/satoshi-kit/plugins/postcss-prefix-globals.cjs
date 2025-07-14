// LLM generated code
const selectorsToPrefix = [
	"button,input,optgroup,select,textarea,::file-selector-button",
	"*,::before,::after,::backdrop,::file-selector-button",
	"button,input:where([type='button'], [type='reset'], [type='submit']),::file-selector-button",
];

function prefixElementItself(selector) {
	return selector
		.split(",")
		.map((sel) => {
			const trimmed = sel.trim();
			if (trimmed.startsWith("::")) return trimmed;
			if (trimmed === "*") return '*[class^="satoshi-kit--"]';

			// For cases like input:where(...), add the attribute at the end
			// Matches: tag(:pseudo-classes and others)
			const match = trimmed.match(/^([a-zA-Z][a-zA-Z0-9-]*)(.*)$/);
			if (match) {
				const [, tag, rest] = match;
				return `${tag}${rest}[class^="satoshi-kit--"]`;
			}
			// Fallback for anything else
			return `${trimmed}[class^="satoshi-kit--"]`;
		})
		.join(", ");
}

module.exports = () => ({
	postcssPlugin: "postcss-prefix-globals",
	Once(root) {
		root.walkRules((rule) => {
			if (selectorsToPrefix.includes(rule.selector)) {
				rule.selector = prefixElementItself(rule.selector);
			}
		});
	},
});

module.exports.postcss = true;
