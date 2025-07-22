import { defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
	subtitle: {
		value: {
			fontSize: "xl",
			fontFamily: "body",
			fontWeight: "medium",
		},
	},
	sm: {
		value: {
			fontSize: "sm",
			fontFamily: "body",
			fontWeight: "normal",
		},
	},
	md: {
		value: {
			fontFamily: "body",
			fontSize: "sm",
			fontWeight: "medium",
			lineHeight: "normal",
		},
	},
	xs: {
		value: {
			fontSize: "xs",
			fontFamily: "body",
			fontWeight: "normal",
		},
	},
	lg: {},
});
