import { defineSemanticTokens } from "@pandacss/dev";

export const colors = defineSemanticTokens.colors({
	bg: {
		default: {
			value: {
				_light: "{colors.neutral.100}",
				_dark: "{colors.neutral.700}",
			},
		},
		canvas: {
			value: {
				_light: "{colors.neutral.50}",
				_dark: "{colors.neutral.800}",
			},
		},
		hover: {
			value: {
				_light: "{colors.neutral.200}",
				_dark: "{colors.neutral.600}",
			},
		},
		subtle: {
			value: {
				_light: "{colors.neutral.100}",
				_dark: "{colors.neutral.800}",
			},
		},
		emphasized: {
			value: {
				_light: "{colors.neutral.700}",
				_dark: "{colors.neutral.700}",
			},
		},
	},
	fg: {
		default: {
			value: {
				_light: "{colors.neutral.600}",
				_dark: "{colors.neutral.300}",
			},
		},
	},
	text: {
		onEmphasized: {
			default: {
				value: {
					_light: "{colors.neutral.50}",
					_dark: "{colors.neutral.200}",
				},
			},
			muted: {
				value: {
					_light: "{colors.neutral.400}",
					_dark: "{colors.neutral.500}",
				},
			},
		},
	},
});
