import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "@midl/satoshi-kit/styles.css";

// biome-ignore lint/style/useNodejsImportProtocol: polyfill
import { Buffer } from "buffer";
import type { EnhanceAppContext } from "vitepress";
import LegalLayout from "./layouts/LegalLayout.vue";

if (typeof window !== "undefined") {
	window.Buffer = Buffer;
	window.global = window;
}
// biome-ignore lint/suspicious/noExplicitAny: polyfill
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

const theme = {
	extends: DefaultTheme,
	enhanceApp({ app }: EnhanceAppContext) {
		app.component("legal", LegalLayout);
	},
};

export default theme;
