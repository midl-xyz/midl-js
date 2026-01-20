import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const EXTENSIONS_DIR = join(__dirname, "../.extensions");

export interface ExtensionConfig {
	name: string;
	url: string;
	zipFile: string;
	destDir: string;
	extractedDirName?: string;
}

export const EXTENSIONS: Record<string, ExtensionConfig> = {
	unisat: {
		name: "Unisat",
		url: "https://github.com/unisat-wallet/extension/releases/download/v1.5.1/unisat-chrome-mv3-v1.5.1-release.zip",
		zipFile: "unisat.zip",
		destDir: "unisat",
	},
	leather: {
		name: "Leather",
		url: "https://github.com/leather-io/extension/releases/download/v6.55.0/leather-chromium.v6.55.0.zip",
		zipFile: "leather.zip",
		destDir: "leather",
		extractedDirName: "leather-chromium-v6.55.0",
	},
};
