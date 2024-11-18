import type { Page } from "@playwright/test";
import type { Wallet } from "~/fixtures/wallet";

export const unisat: Wallet = {
	async isWalletLocked({ page }) {
		return page.getByText("Unlock", { exact: true }).isVisible();
	},
	async unlockWallet({ page, skipNavigation }) {
		if (await unisat.isWalletLocked({ page })) {
			if (!skipNavigation) {
				await page.waitForLoadState("networkidle");
				await page.goto(
					"chrome-extension://boecohhhjhnaabnbbeddfaoiomabiehj/index.html#/account/unlock",
					{ waitUntil: "networkidle" },
				);
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

		await page.waitForTimeout(500);

		const isVisible = await page.getByLabel("loading").isVisible();

		if (isVisible) {
			await page.reload({ waitUntil: "networkidle" });
		}

		if (await unisat.isWalletLocked({ page })) {
			await unisat.unlockWallet({ page });
			await page.waitForTimeout(500);

			return;
		}

		await page.locator('input[type="password"]').first().fill("password");
		await page.locator('input[type="password"]').last().fill("password");
		await page.getByText("Continue").click();
		await page.getByText("XVerse Wallet").click();
		const mnemonic = process.env.MNEMONIC.split(" ");

		const inputs = await page.locator('input[type="password"]').all();

		for (let i = 0; i < mnemonic.length; i++) {
			await inputs[i].fill(mnemonic[i]);
		}

		await page.waitForTimeout(500);

		await page.getByText("Continue").click();

		await page.getByText("Taproot").click();

		await page.waitForTimeout(500);

		await page.getByText("Continue").click();

		await page.waitForTimeout(5001);

		await page.locator('input[type="checkbox"]').first().check();
		await page.locator('input[type="checkbox"]').last().check();

		await page.getByText("OK").click();
	},

	async changeNetwork({ page, extensionId }, networkName) {
		await page.goto(`chrome-extension://${extensionId}/index.html#/settings`, {
			waitUntil: "networkidle",
		});

		await page.getByText("Network").click();

		await page.getByText(networkName).last().click();
	},
	async connectWallet({ context, extensionId }) {
		const page = await new Promise<Page>((resolve) => {
			const onNewPage = async (page: Page) => {
				if (page.url().includes(extensionId)) {
					await page.waitForTimeout(500);
					await page.bringToFront();
					await unisat.unlockWallet({ page, skipNavigation: true });
					resolve(page);
				}

				context.off("page", onNewPage);
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

					context.off("page", onNewPage);
				};

				context.on("page", onNewPage);
			});
		}

		if (!page) {
			throw new Error("No notification page found");
		}

		await page.waitForTimeout(500);
		await page.bringToFront();
		await unisat.unlockWallet({ page, skipNavigation: true });

		await page
			.getByText("Sign", {
				exact: true,
			})
			.last()
			.click();
	},
};
