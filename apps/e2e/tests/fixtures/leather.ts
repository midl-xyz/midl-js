import type { Page } from "@playwright/test";

import type { Wallet } from "~/fixtures/wallet";
import { regtest } from "@midl-xyz/midl-js-core";
import { selectors } from "./selectors";

const PASSWORD = "533LZVJ55G7Z965DH9QHWVRH";

const setPassword = async (page: Page, input = selectors.passwordInput) => {
	await page.getByTestId(input).fill(PASSWORD);
	await page.waitForTimeout(100);
	await page.getByText(selectors.continue).click();
	await page.waitForTimeout(5000);
};

export const leather: Wallet = {
	async isWalletLocked({ page }) {
		return page.getByText("Unlock", { exact: true }).isVisible();
	},
	async unlockWallet({ page, skipNavigation }) {
		if (await leather.isWalletLocked({ page })) {
			if (!skipNavigation) {
				await page.waitForLoadState("networkidle");
				await page.goto("", { waitUntil: "networkidle" });
			}

			await page.locator(selectors.passwordType).first().fill("password");
			await page.getByText(selectors.unlock).click();
		}
	},
	async configureWallet({ page, extensionId }) {
		if (!process.env.MNEMONIC) {
			throw new Error("No mnemonic provided");
		}
		await page.waitForLoadState("networkidle");

		await page.goto(
			`chrome-extension://${extensionId}/index.html#/account/create-password`,
		);

		const isVisible = await page.getByLabel("loading").isVisible();

		if (isVisible) {
			await page.reload({ waitUntil: "networkidle" });
		}
		if (await leather.isWalletLocked({ page })) {
			await leather.unlockWallet({ page });
			await page.waitForTimeout(500);

			return;
		}
		const blockPage = page.getByTestId(selectors.passwordInput);
		const startPage = page.getByText(selectors.useKey);

		if ((await startPage.count()) > 0) {
			await page.getByText(selectors.useKey).click();

			const seedPassword = process.env.MNEMONIC.split(" ");

			for (let i = 0; i < seedPassword.length; i++) {
				await page.getByTestId(`mnemonic-input-${i + 1}`).fill(seedPassword[i]);
			}

			await page.waitForTimeout(1000);
			await page.getByText(selectors.continue).click();
			await page.waitForTimeout(1000);
			await setPassword(page, selectors.setOrEnterPassword);
		}
		if ((await blockPage.count()) > 0) {
			await setPassword(page);
		}
	},

	async changeNetwork({ page, extensionId }) {
		const blockPage = page.getByTestId(selectors.passwordInput);

		await page.goto(`chrome-extension://${extensionId}/index.html`);
		if ((await blockPage.count()) > 0) {
			await setPassword(page);
		}

		const menu = page.locator(selectors.menu);

		await menu.click();

		const network = page.locator(selectors.mainnet);

		if ((await network.count()) > 0) {
			await network.click({ force: true });

			const span = page.getByText(selectors.addNetwork);
			const nameNetwork = "MIDL REGTEST";
			const networkKey = "regtest";
			await span.click();
			await page.getByTestId(selectors.networkName).fill(nameNetwork);
			await page.getByTestId(selectors.networkKey).fill(networkKey);
			await page.getByTestId(selectors.networkBTC).fill(regtest.rpcUrl);

			await page.getByTestId(selectors.addBTC).click();
			await page.waitForTimeout(1000);

			const regtestElement = page.getByTestId(selectors.btcRegtest);

			await page.waitForTimeout(1000);

			await regtestElement.click();

			await page.getByTestId(selectors.addNetworkBtn).click();
			await page.waitForTimeout(3000);
		}

		await page.waitForTimeout(3000);
	},

	async connectWallet({ context, extensionId }) {
		const page = await new Promise<Page>((resolve) => {
			const onNewPage = async (page: Page) => {
				if (page.url().includes(extensionId)) {
					await page.waitForTimeout(500);
					await page.bringToFront();

					resolve(page);
				}

				context.off("page", onNewPage);
				await setPassword(page);
				await page.getByText(selectors.confirm).click();
			};

			context.on("page", onNewPage);
		});

		if (!page) {
			throw new Error("No notification page found");
		}
	},

	async acceptSign({ context, extensionId }) {
		let page = context
			.pages()
			.find(
				(page) =>
					page
						.url()
						.includes(`chrome-extension://${extensionId}/notification.html`) ||
					page.url().includes(`chrome-extension://${extensionId}/popup.html`),
			);

		if (!page) {
			page = await new Promise<Page>((resolve) => {
				const onNewPage = async (page: Page) => {
					if (page.url().includes(extensionId)) {
						resolve(page);
					}
					context.off("page", onNewPage);
				};

				context.on("page", onNewPage);
			});
		}

		if (!page) {
			return;
		}

		await page.bringToFront();
		await page.waitForLoadState("networkidle");

		if (await page.getByTestId(selectors.passwordInput).isVisible()) {
			await leather.unlockWallet({ page, skipNavigation: true });

			await setPassword(page);
		}

		const confirm = await page.getByText(selectors.confirm).isVisible();
		console.log("Is Confirm button visible:", confirm);
		const sign = await page
			.getByRole("button", { name: selectors.sign })
			.isVisible();
		console.log("Is Confirm button visible:", sign);
		if (confirm) {
			await page.getByText(selectors.confirm).click({ force: true });
		}

		if (sign) {
			await page.getByText(selectors.sign, { exact: true }).click();
		}
	},
};
