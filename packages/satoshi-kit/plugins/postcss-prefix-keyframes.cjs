// LLM generated code
module.exports = (opts = {}) => {
	const prefix = opts.prefix || "";
	return {
		postcssPlugin: "postcss-prefix-keyframes",
		Once(root) {
			const keyframes = new Set();

			// First pass: find all keyframe names
			root.walkAtRules("keyframes", (rule) => {
				keyframes.add(rule.params);
			});

			// Prefix keyframe definitions
			root.walkAtRules("keyframes", (rule) => {
				rule.params = prefix + rule.params;
			});

			// Prefix animation name usage
			root.walkDecls((decl) => {
				// only handle string values
				const prop = decl.prop;

				// 1. animation-name
				if (prop === "animation-name") {
					decl.value = decl.value
						.split(",")
						.map((name) => {
							const n = name.trim();
							return keyframes.has(n) ? prefix + n : n;
						})
						.join(", ");
				}

				// 2. animation shorthand
				if (prop === "animation") {
					// Split by commas for multiple animations
					decl.value = decl.value
						.split(",")
						.map((anim) => {
							// first "word" is usually animation-name
							const tokens = anim.trim().split(/\s+/);
							if (tokens.length && keyframes.has(tokens[0])) {
								tokens[0] = prefix + tokens[0];
							}
							return tokens.join(" ");
						})
						.join(", ");
				}

				// 3. custom properties (if value starts with known keyframe name)
				if (prop.startsWith("--")) {
					decl.value = decl.value.replace(
						new RegExp(`\\b(${[...keyframes].join("|")})\\b`, "g"),
						(m) => prefix + m,
					);
				}
			});
		},
	};
};
module.exports.postcss = true;
