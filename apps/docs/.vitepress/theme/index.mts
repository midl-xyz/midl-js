import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "@midl/satoshi-kit/styles.css";

// biome-ignore lint/style/useNodejsImportProtocol: polyfill
import { Buffer } from "buffer";
if (typeof window !== "undefined") {
	window.Buffer = Buffer;
	window.global = window;
}
// biome-ignore lint/suspicious/noExplicitAny: polyfill
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

export default DefaultTheme;
