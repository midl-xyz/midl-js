import { defineRecipe } from "@pandacss/dev";

export const spinner = defineRecipe({
	className: "spinner",
	base: {
		display: "inline-block",
		color: "colorPalette.default",
		width: "var(--size)",
		height: "var(--size)",
		animation: "spin",
		animationDuration: "1s",
	},
	defaultVariants: {
		size: "md",
	},
	variants: {
		size: {
			xs: { "--size": "sizes.3" },
			sm: { "--size": "sizes.4" },
			md: { "--size": "sizes.6" },
			lg: { "--size": "sizes.8" },
			xl: { "--size": "sizes.12" },
		},
	},
});
