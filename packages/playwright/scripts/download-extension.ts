import { createReadStream, createWriteStream } from "node:fs";
import { access, constants, mkdir, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Extract } from "unzipper";
import type { ExtensionConfig } from "./extensions.config.js";

export async function downloadAndExtractExtension(
	config: ExtensionConfig,
	baseDir: string,
	scriptsDir: string,
): Promise<void> {
	const { name, url, zipFile, destDir, extractedDirName } = config;
	const zipPath = join(scriptsDir, zipFile);
	const finalDir = join(baseDir, destDir);

	try {
		await access(finalDir, constants.F_OK);
		console.log(`✅ ${name} already exists`);
		return;
	} catch {}

	const cleanup = async () => {
		try {
			await unlink(zipPath);
		} catch {}
	};

	try {
		await mkdir(baseDir, { recursive: true });

		console.log(`📥 Downloading ${name}...`);
		const response = await fetch(url);
		if (!response.ok || !response.body) {
			throw new Error(`Failed to download: ${response.statusText}`);
		}
		await pipeline(response.body, createWriteStream(zipPath));

		console.log("📦 Extracting...");
		const extractDir = extractedDirName ? baseDir : finalDir;
		await pipeline(createReadStream(zipPath), Extract({ path: extractDir }));

		if (extractedDirName) {
			await rename(join(baseDir, extractedDirName), finalDir);
		}

		await cleanup();
		console.log(`✅ ${name} ready\n`);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`❌ ${name} failed: ${message}`);
		await cleanup();
		throw error;
	}
}
