import type { Page } from "@playwright/test";
import type { TestArgs } from "~/fixtures/test";
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

		if (
			!(await page.getByText(
				"Your password is used to secure your Secret Key and is only used locally on your device",
			))
		) {
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
		} else {
			await page.getByTestId("password-input").fill("533LZVJ55G7Z965DH9QHWVRH");
			await page.waitForTimeout(100);
			await page.getByText("Continue").click();
		}
	},

	async changeNetwork({ page, extensionId }) {
		await page.goto(`chrome-extension://${extensionId}/index.html`);
		await page.getByTestId("password-input").fill("533LZVJ55G7Z965DH9QHWVRH");
		await page.waitForTimeout(100);
		await page.getByText("Continue").click();
		await page.waitForTimeout(3000);
		const menu = await page.locator('[aria-haspopup="menu"]');

		await menu.click();

		const network = await page.locator("text=mainnet");
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
		const regtestElement = page.locator('option[value="regtest"]');

		await page.waitForTimeout(1000);

		await regtestElement.click();

		await page.screenshot({ path: "screen4.png" });
	},

	connectWallet: ({
		context,
		extensionId,
	}: Pick<TestArgs, "context" | "extensionId">): Promise<void> => {
		throw new Error("Function not implemented.");
	},
	acceptSign: ({
		context,
		extensionId,
	}: Pick<TestArgs, "context" | "extensionId">): Promise<void> => {
		throw new Error("Function not implemented.");
	},
};
