import { dialogAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const dialog = defineSlotRecipe({
	className: "dialog",
	slots: dialogAnatomy.keys(),
	base: {
		backdrop: {
			backdropFilter: "blur(2px)",
			background: {
				_light: "neutral.a100",
				_dark: "neutral.a800",
			},
			height: "100vh",
			left: "0",
			position: "fixed",
			top: "0",
			width: "100vw",
			zIndex: "overlay",
			_open: {
				animation: "backdrop-in",
			},
			_closed: {
				animation: "backdrop-out",
			},
		},
		positioner: {
			alignItems: "center",
			display: "flex",
			justifyContent: "center",
			left: "0",
			overflow: "auto",
			position: "fixed",
			top: "0",
			width: "100vw",
			height: "100dvh",
			zIndex: "modal",
		},
		content: {
			background: "bg.canvas",
			borderRadius: "2xl",
			boxShadow: "lg",
			minW: "sm",
			position: "relative",
			_open: {
				animation: "dialog-in",
			},
			_closed: {
				animation: "dialog-out",
			},
		},
		title: {
			fontWeight: "semibold",
			textStyle: "lg",
		},
		description: {
			color: "fg.muted",
			textStyle: "sm",
		},
	},
});
