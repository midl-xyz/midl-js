// LLM generated code
const selectorsToRemove = [
	"textarea",
	"table",
	"summary",
	"small",
	"sub,sup",
	"sub",
	"sup",
	"dialog",
	"a",
	"abbr:where([title])",
	"b,strong",
	"code,kbd,samp,pre",
	"progress",
	"::-webkit-search-decoration",
	"::-webkit-search-cancel-button",
	"::-webkit-inner-spin-button",
	"::-webkit-outer-spin-button",
	":-moz-ui-invalid",
	":-moz-focusring",
	"[hidden]:where(:not([hidden='until-found'])):not(#\\#):not(#\\#):not(#\\#):not(#\\#):not(#\\#):not(#\\#):not(#\\#):not(#\\#):not(#\\#)",
	"*:not(#\\#)",
	"*:not(#\\#)::before",
	"*:not(#\\#)::after",
	"*:not(#\\#)::placeholder",
	"*:not(#\\#)::selection",
	":root:not(#\\#)",
	"body:not(#\\#)",
	".dark:not(#\\#) body",
	"hr",
	"body",
	"img",
	"img,svg,video,canvas,audio,iframe,embed,object",
	"img,video",
	"h1,h2,h3,h4,h5,h6",
	"p,h1,h2,h3,h4,h5,h6",
	"ol,ul,menu",
	"::placeholder",
	"::-webkit-search-decoration,::-webkit-search-cancel-button",
	"::-webkit-inner-spin-button,::-webkit-outer-spin-button",
	"*:not(#\\#),*:not(#\\#)::before,*:not(#\\#)::after",
	"button,input,optgroup,select,textarea,::file-selector-button",
	"html,:host",
];

module.exports = () => ({
	postcssPlugin: "postcss-remove-global-resets",
	Once(root) {
		root.walkRules((rule) => {
			// Remove if selector matches any in the list (including exact match for grouped selectors)
			if (selectorsToRemove.includes(rule.selector)) {
				rule.remove();
			}
		});
	},
});
module.exports.postcss = true;
