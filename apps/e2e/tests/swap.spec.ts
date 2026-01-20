import { getRune, waitForTransaction } from "@midl/core";
import { type Wallet, createTest } from "@midl/playwright";
import type { Page } from "@playwright/test";
import { midlConfig } from "../config";

const mnemonic =
	process.env.MNEMONIC ??
	"test test test test test test test test test test test junk";

const { test } = createTest({
	mnemonic,
	extension: "leather",
	shouldPersist: false,
});

const connectWallet = async (wallet: Wallet, page: Page) => {
	const isConnected = await page.getByText("Connect Wallet").isHidden();

	if (!isConnected) {
		await page
			.getByRole("button", {
				name: "Connect Wallet",
			})
			.click();
		await page.getByRole("button", { name: "Leather" }).click();
		await wallet.connect();

		await page
			.getByRole("button", {
				name: "Connect Wallet",
			})
			.waitFor({ state: "hidden" });
	}
};

test.describe("Add Liquidity Flow", () => {
	test.describe.configure({ mode: "serial" });

	const runeName = `RUNEE2ETEST${Math.random().toString(36).substring(2, 16).toUpperCase()}`;

	test.beforeEach(async ({ wallet }) => {
		await wallet.configure();
		await wallet.changeNetwork("regtest");
	});

	test("create new rune", async ({ wallet, page }) => {
		await page.goto("https://rune-etcher.midl.xyz/");

		await page.getByRole("combobox").click();
		await page.getByRole("option", { name: "REGTEST" }).click();

		await connectWallet(wallet, page);

		await page.locator("input[name='name']").fill(runeName);
		await page.getByRole("button", { name: "Etch Rune" }).click();

		await wallet.confirmTransaction();
		await wallet.confirmTransaction();
		await wallet.confirmTransaction();

		await page.getByRole("dialog").waitFor({ state: "visible" });
		await page.getByRole("dialog").waitFor({ state: "hidden" });

		const rune = await getRune(midlConfig, runeName);

		if (!rune) {
			throw new Error("Rune was not created");
		}

		if (!rune.location?.tx_id) {
			throw new Error("Rune transaction ID is missing");
		}

		await waitForTransaction(midlConfig, rune.location.tx_id, 6);
	});

	test("edict rune", async ({ wallet, page }) => {
		await page.goto("https://swap.midl.xyz/swap");

		await connectWallet(wallet, page);

		await page.getByRole("button", { name: "Select a token" }).first().click();
		await page
			.locator("input[placeholder='Search name or paste address']")
			.fill(runeName);

		await page.getByRole("button", { name: "Add rune" }).click();

		await page.getByRole("button", { name: "Add rune" }).click();

		await wallet.confirmTransaction();

		await page
			.getByText(
				"The transaction has been confirmed. The rune has been added to the MIDL ecosystem.",
			)
			.waitFor({ state: "visible" });
	});
});
