/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "node:path";
import { extensions } from "~/config";
import type { Wallet, WalletConstructor } from "~/wallets/Wallet";

type CreateTestParams = {
	mnemonic: string;
	extension?: string;
	shouldPersist?: boolean;
	walletPassword?: string;
};

export const createTest = ({
	mnemonic,
	extension = "leather",
	shouldPersist = true,
	walletPassword = "W(6RgP.3q&AeCLHr",
}: CreateTestParams) => {
	if (!mnemonic) {
		throw new Error("Mnemonic is required");
	}

	const persistDir = shouldPersist
		? path.join(extensions.path, `./.data/${extension}`)
		: "";

	const test = base.extend<{
		context: BrowserContext;
		extensionId: string;
		wallet: Wallet;
		mnemonic: string;
	}>({
		// biome-ignore lint/correctness/noEmptyPattern: Playwright requires an empty object here
		context: async ({}, use) => {
			const pathToExtension = path.join(extensions.path, extension);
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
			let [background] = context.serviceWorkers();
			if (!background) background = await context.waitForEvent("serviceworker");

			const extensionId = background.url().split("/")[2];
			await use(extensionId);
		},
		wallet: async ({ extensionId, context }, use) => {
			const WalletConstructor = (await import(`../wallets/${extension}`).then(
				(m) => m.default,
			)) as WalletConstructor;

			const wallet = new WalletConstructor(
				context,
				extensionId,
				mnemonic,
				walletPassword,
			);

			const walletPage = await wallet.getPage();
			await walletPage.close();
			await wallet.configure();

			await use(wallet);
		},
	});

	const expect = test.expect;

	return { test, expect };
};

export type TestArgs = Parameters<
	Parameters<ReturnType<typeof createTest>["test"]>[2]
>[0];
