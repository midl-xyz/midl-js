import type { Page } from "@playwright/test";
import { type NetworkName, supportedNetworks, Wallet } from "~/wallets/Wallet";

export class LeatherWallet extends Wallet implements Wallet {
	async configure(): Promise<void> {
		const page = await this.context.newPage();

		await page.goto(
			`chrome-extension://${this.extensionId}/index.html#/get-started`,
			{
				waitUntil: "networkidle",
			},
		);

		const createNewWalletButton = page.getByText("Use existing key");

		if (await createNewWalletButton.isVisible()) {
			await createNewWalletButton.click();
			await this.createWallet(page);
		}

		await this.unlock(page);

		await page.close();
	}

	private async createWallet(page: Page): Promise<void> {
		for (const [index, word] of this.mnemonic.split(" ").entries()) {
			await page
				.locator(`*:has(label:text-is("Word ${index + 1}")) > input`)
				.fill(word);
		}

		await page.getByText("Continue").click();

		await page
			.locator("*:has(label:text-is('Password')) > input")
			.fill(this.password);

		await page.getByText("Continue").click();
		await page.waitForURL(
			`chrome-extension://${this.extensionId}/index.html#/`,
			{
				waitUntil: "networkidle",
			},
		);
	}

	async unlock(page: Page): Promise<void> {
		if (await this.isLocked(page)) {
			await page.getByPlaceholder("Enter your password").fill(this.password);

			await page.getByText("Continue").click();
			await page
				.getByPlaceholder("Enter your password")
				.waitFor({ state: "hidden" });
		}
	}

	async isLocked(page: Page): Promise<boolean> {
		const isVisible = await page.getByText("Enter your password").isVisible();
		const isUnlockURL = page.url().includes("#/unlock");

		return isVisible && isUnlockURL;
	}
	async changeNetwork(networkName: NetworkName): Promise<void> {
		const page = await this.context.newPage();
		await page.goto(`chrome-extension://${this.extensionId}/index.html`);
		await this.unlock(page);

		await page.getByTestId("settings-menu-trigger").click();
		await page.getByRole("menuitem", { name: "Change network" }).click();

		const currentNetwork = await page
			.locator("button:has([data-testid='network-active-network']) span")
			.first()
			.textContent();

		switch (networkName) {
			case "mainnet": {
				if (currentNetwork?.includes("Mainnet")) {
					break;
				}
				await page.getByText("Mainnet").click();
				break;
			}

			case "testnet": {
				if (currentNetwork?.includes("Testnet3")) {
					break;
				}

				await page.getByText("Testnet3").click();
				break;
			}

			case "testnet4": {
				if (currentNetwork?.includes("Testnet4")) {
					break;
				}

				await page.getByText("Testnet4").click();
				break;
			}

			case "regtest": {
				if (currentNetwork?.includes("Regtest")) {
					break;
				}

				const element = page.getByText("Regtest");

				if (await element.isVisible()) {
					await element.click();
					break;
				}

				await this.createNetwork(networkName, "Regtest");

				break;
			}
		}

		await page.close();
	}

	private async createNetwork(
		networkName: NetworkName,
		networkDisplayName: string,
	): Promise<void> {
		const page = await this.context.newPage();
		await page.goto(
			`chrome-extension://${this.extensionId}/index.html#/add-network`,
		);

		await page.getByTestId("network-name").fill(networkDisplayName);

		await page.getByTestId("add-network-bitcoin-api-selector").click();
		await page.getByTestId(`bitcoin-api-option-${networkName}`).click();

		await page
			.getByTestId("network-bitcoin-address")
			.fill(supportedNetworks[networkName].rpcUrl);

		await page.getByTestId("network-key").fill(networkName);
		await page.getByRole("button", { name: "Add network" }).click();
		await page
			.getByRole("button", { name: "Add network" })
			.waitFor({ state: "detached" });

		await page.waitForURL(
			`chrome-extension://${this.extensionId}/index.html#/`,
			{
				waitUntil: "networkidle",
			},
		);

		await page.close();
	}

	async connect(): Promise<void> {
		const page = await this.getPage();
		await this.unlock(page);
		await page.getByRole("button", { name: "Confirm" }).click();
	}
	async confirmSignature(): Promise<void> {
		const page = await this.getPage();
		await this.unlock(page);

		await page.getByRole("button", { name: "Sign" }).click();
	}

	async confirmTransaction(): Promise<void> {
		const page = await this.getPage();
		await this.unlock(page);

		await page.getByRole("button", { name: "Confirm" }).click();
	}
	async cancelSignature(): Promise<void> {
		const page = await this.getPage();
		await this.unlock(page);

		await page.getByRole("button", { name: "Deny" }).click();
	}
	async cancelTransaction(): Promise<void> {
		const page = await this.getPage();
		await this.unlock(page);

		await page.getByRole("button", { name: "Cancel" }).click();
	}
}
