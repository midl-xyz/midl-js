import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "@midl/satoshi-kit/styles.css";
import type { EnhanceAppContext } from "vitepress";
import Layout from "./layouts/Layout.vue";
import LegalLayout from "./layouts/LegalLayout.vue";

// biome-ignore lint/suspicious/noExplicitAny: polyfill
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

const theme = {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.component("legal", LegalLayout);
	},
};

export default theme;
