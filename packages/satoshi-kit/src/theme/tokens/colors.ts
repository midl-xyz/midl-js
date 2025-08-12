import { defineTokens } from "@pandacss/dev";

export const colors = defineTokens.colors({
	current: { value: "currentColor" },
	neutral: {
		50: {
			value: "#FDFDFD",
		},
		100: {
			value: "#F0F0F0",
		},
		200: {
			value: "#e7e7e7",
		},
		300: {
			value: "#CBCBCB",
		},
		500: {
			value: "#666666",
		},
		600: {
			value: "#333333",
		},
		700: {
			value: "#202020",
		},
		800: {
			value: "#0E0E0E",
		},
		a100: {
			value: "#F0F0F0CC",
		},
		a800: {
			value: "#0E0E0ECC",
		},
	},
	gray: {
		a3: {
			value: "#CBCBCB",
		},
		a7: {
			value: "#666666",
		},
	},
});
