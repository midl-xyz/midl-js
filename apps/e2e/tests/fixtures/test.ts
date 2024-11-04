import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const persistDir = path.join(__dirname, "../../extensions/unisat-data");

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: Playwright requires an empty object here
	context: async ({}, use) => {
		const pathToExtension = path.join(__dirname, "../../extensions/unisat");
		const context = await chromium.launchPersistentContext(persistDir, {
			headless: false,
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		});
		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		/*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

		// for manifest v3:
		let [background] = context.serviceWorkers();
		if (!background) background = await context.waitForEvent("serviceworker");

		const extensionId = background.url().split("/")[2];
		await use(extensionId);
	},
});

export const expect = test.expect;

export type TestArgs = Parameters<Parameters<typeof test>[2]>[0];
