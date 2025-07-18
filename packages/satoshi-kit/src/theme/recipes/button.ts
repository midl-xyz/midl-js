import { defineRecipe } from "@pandacss/dev";

export const button = defineRecipe({
	className: "button",
	jsx: ["Button", "IconButton", "SubmitButton"],
	base: {
		alignItems: "center",
		appearance: "none",
		borderRadius: "10xl",
		cursor: "pointer",
		display: "inline-flex",
		fontWeight: "semibold",
		isolation: "isolate",
		minWidth: "0",
		justifyContent: "center",
		outline: "none",
		position: "relative",
		transitionDuration: "normal",
		transitionProperty: "background, border-color, color, box-shadow",
		transitionTimingFunction: "default",
		userSelect: "none",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
		_hidden: {
			display: "none",
		},
		"& :where(svg)": {
			fontSize: "1.1em",
			width: "1.1em",
			height: "1.1em",
		},
	},
	defaultVariants: {
		variant: "solid",
		size: "md",
	},
	variants: {
		variant: {
			solid: {
				background: "bg.default",
				color: "fg.default",
				_hover: {
					background: "bg.hover",
				},
				_focusVisible: {
					outline: "2px solid",
					outlineColor: "colorPalette.default",
					outlineOffset: "2px",
				},
				_disabled: {
					color: "fg.disabled",
					background: "bg.disabled",
					cursor: "not-allowed",
					_hover: {
						color: "fg.disabled",
						background: "bg.disabled",
					},
				},
			},
			ghost: {
				background: "transparent",
				color: "fg.default",
				borderRadius: "md",
				colorPalette: "gray",
				_hover: {
					background: "bg.subtle",
				},
				_selected: {
					background: "colorPalette.a3",
				},
				_disabled: {
					color: "fg.disabled",
					cursor: "not-allowed",
					_hover: {
						background: "transparent",
						color: "fg.disabled",
					},
				},
				_focusVisible: {
					outline: "2px solid",
					outlineColor: "colorPalette.default",
					outlineOffset: "2px",
				},
			},
		},
		size: {
			md: {
				h: "11",
				minW: "10",
				textStyle: "md",
				px: "6",
				gap: "2",
			},
		},
	},
});
