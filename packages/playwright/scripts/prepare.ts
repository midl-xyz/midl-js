#!/usr/bin/env node

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { downloadAndExtractExtension } from "./download-extension.js";
import { EXTENSIONS, EXTENSIONS_DIR } from "./extensions.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	if (process.env.MIDL_PLAYWRIGHT_INSTALL_EXTENSIONS !== "true") {
		return;
	}

	console.log("\n🚀 Setting up browser extensions\n");

	const extensions = Object.values(EXTENSIONS);

	for (const extension of extensions) {
		try {
			await downloadAndExtractExtension(extension, EXTENSIONS_DIR, __dirname);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`Failed to setup ${extension.name}:`, message);
		}
	}

	console.log("✨ Setup complete\n");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
