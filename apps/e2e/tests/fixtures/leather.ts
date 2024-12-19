import type { Page } from "@playwright/test";

import type { Wallet } from "~/fixtures/wallet";

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

			await page.locator('input[type="password"]').first().fill("password");
			await page.getByText("Unlock").click();
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
		const blockPage = await page.locator('input[data-testid="password-input"]');
		const startPage = await page.getByText("Use existing key");

		if ((await startPage.count()) > 0) {
			await page.getByText("Use existing key").click();

			const seedPassword = process.env.MNEMONIC.split(" ");

			for (let i = 0; i < seedPassword.length; i++) {
				await page.getByTestId(`mnemonic-input-${i + 1}`).fill(seedPassword[i]);
			}

			await page.waitForTimeout(1000);
			await page.getByText("Continue").click();
			await page.waitForTimeout(1000);

			await page
				.getByTestId("set-or-enter-password-input")
				.fill("533LZVJ55G7Z965DH9QHWVRH");
			await page.waitForTimeout(100);
			await page.getByText("Continue").click();
			await page.waitForTimeout(3000);
		}
		if ((await blockPage.count()) > 0) {
			await page.getByTestId("password-input").fill("533LZVJ55G7Z965DH9QHWVRH");
			await page.waitForTimeout(100);
			await page.getByText("Continue").click();
		}
	},

	async changeNetwork({ page, extensionId }) {
		const blockPage = page.locator('input[data-testid="password-input"]');

		await page.goto(`chrome-extension://${extensionId}/index.html`);
		if ((await blockPage.count()) > 0) {
			await page.getByTestId("password-input").fill("533LZVJ55G7Z965DH9QHWVRH");
			await page.waitForTimeout(100);
			await page.getByText("Continue").click();
			await page.waitForTimeout(3000);
		}

		const menu = await page.locator('[aria-haspopup="menu"]');

		await menu.click();

		const network = await page.locator("text=mainnet");

		if ((await network.count()) > 0) {
			await network.click({ force: true });

			const span = await page.getByText("Add a network");

			await span.click();
			await page.getByTestId("network-name").fill("MIDL REGTEST");
			await page.getByTestId("network-key").fill("regtest");
			await page
				.getByTestId("network-bitcoin-address")
				.fill("https://regtest-mempool.midl.xyz/api");

			await page.getByTestId("add-network-bitcoin-api-selector").click();
			await page.waitForTimeout(1000);
			// await page.locator("text=Regtest").click();
			const regtestElement = page.getByTestId("bitcoin-api-option-regtest");

			await page.waitForTimeout(1000);

			await regtestElement.click();

			await page.getByTestId("add-network-btn").click();
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
				await page
					.getByTestId("password-input")
					.fill("533LZVJ55G7Z965DH9QHWVRH");
				await page.waitForTimeout(100);
				await page.getByText("Continue").click();
				await page.waitForTimeout(3000);
				await page.getByText("Confirm").click();
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
			.find((page) =>
				page
					.url()
					.includes(`chrome-extension://${extensionId}/notification.html`),
			);

		if (!page) {
			page = await new Promise<Page>((resolve) => {
				const onNewPage = async (page: Page) => {
					if (page.url().includes(extensionId)) {
						resolve(page);
					}

					await context.off("page", onNewPage);
				};

				context.on("page", onNewPage);
			});
			await page.bringToFront();
			await leather.unlockWallet({ page, skipNavigation: true });

			await page.getByTestId("password-input").fill("533LZVJ55G7Z965DH9QHWVRH");
			await page.waitForTimeout(100);
			await page.getByText("Continue").click();
			await page.waitForTimeout(3000);
			await page.getByText("Confirm").click();
			const check = await page.getByText("Sign");
			if ((await check.count()) > 0) {
				console.log("tut");
			}
		}
		await page.getByText("Sign").click();

		if (!page) {
			throw new Error("No notification page found");
		}
	},
};
