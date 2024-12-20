import { createTest } from "@midl-xyz/playwright-btc-wallets";
import midlConfig from "../app/midl.config";
import { zeroAddress } from "viem";
import { waitForTransaction } from "@midl-xyz/midl-js-core";

const { test, expect } = createTest({
	mnemonic: process.env.MNEMONIC as string,
});

midlConfig.setState({ network: midlConfig.networks[0] });

test.describe("Add Liquidity Flow", () => {
	test.describe.configure({ mode: "serial" });

	test.beforeAll(async ({ wallet }) => {
		await wallet.changeNetwork("regtest");
	});

	test("edict rune", async ({ wallet, page }) => {
		await page.goto("http://localhost:5173", {
			waitUntil: "networkidle",
		});

		const isConnected = await page.getByTestId("address").isVisible();

		if (!isConnected) {
			await page.getByTestId("connect").click();
			await wallet.connect();
			await page.getByTestId("address").waitFor({ state: "visible" });
		}

		let runeAddress = await page
			.getByTestId("edict-address")
			.first()
			.textContent();

		if (!runeAddress || runeAddress === zeroAddress) {
			await page.getByTestId("edict").click();
			await wallet.confirmTransaction();

			const txId = await page.getByTestId("edict-tx-id").first().textContent();
			const error = await page.getByTestId("edict-error").first().textContent();
			if (!txId || error) {
				throw new Error(error || "No txId found");
			}

			console.log(
				`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${txId}`,
			);

			const confirmations = await waitForTransaction(midlConfig, txId);

			expect(confirmations).toBeGreaterThan(0);

			await page.reload({ waitUntil: "networkidle" });

			runeAddress = await page
				.getByTestId("edict-address")
				.first()
				.textContent();

			console.log(`Rune edict at: ${runeAddress}`);
		}
	});

	// test("add liquidity", async ({ page, extensionId, context }) => {
	// 	await page.goto("http://localhost:5173", {
	// 		waitUntil: "networkidle",
	// 	});

	// 	const isConnected = await page.getByTestId("address").isVisible();

	// 	if (!isConnected) {
	// 		await page.getByTestId("connect").click();

	// 		await wallet.connectWallet({ context, extensionId });
	// 	}

	// 	await page
	// 		.getByTestId("address")
	// 		.waitFor({ state: "visible", timeout: 10_000 });

	// 	await page.getByTestId("add-liquidity").click();

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(2000);

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(2000);

	// 	await wallet.acceptSign({ context, extensionId });

	// 	// await page.waitForTimeout(2000);

	// 	// await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(500);

	// 	const btcTx = await page
	// 		.getByTestId("add-liquidity-btc-tx")
	// 		.first()
	// 		.textContent();
	// 	const approveTx = await page
	// 		.getByTestId("add-liquidity-approve-tx")
	// 		.first()
	// 		.textContent();
	// 	const addLiquidityTx = await page
	// 		.getByTestId("add-liquidity-add-liquidity-tx")
	// 		.first()
	// 		.textContent();

	// 	console.log(`BTC tx: ${btcTx}`);
	// 	console.log(`Approve tx: ${approveTx}`);
	// 	console.log(`Add liquidity tx: ${addLiquidityTx}`);

	// 	console.log(
	// 		`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
	// 	);

	// 	const confirmations = await waitForTransaction(midlConfig, btcTx as string);

	// 	expect(confirmations).toBeGreaterThan(0);
	// });

	// test("swap", async ({ page, extensionId, context }) => {
	// 	await page.goto("http://localhost:5173", {
	// 		waitUntil: "networkidle",
	// 	});

	// 	const isConnected = await page.getByTestId("address").isVisible();

	// 	if (!isConnected) {
	// 		await page.getByTestId("connect").click();

	// 		await wallet.connectWallet({ context, extensionId });
	// 	}

	// 	await page
	// 		.getByTestId("address")
	// 		.waitFor({ state: "visible", timeout: 10_000 });

	// 	await page.getByTestId("swap").click();

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(2000);

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(500);

	// 	// await wallet.acceptSign({ context, extensionId });

	// 	// await page.waitForTimeout(500);

	// 	const btcTx = await page.getByTestId("swap-btc-tx").first().textContent();
	// 	const txId = await page.getByTestId("swap-tx-id").first().textContent();

	// 	console.log(`BTC tx: ${btcTx}`);
	// 	console.log(`Swap tx: ${txId}`);

	// 	console.log(
	// 		`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
	// 	);

	// 	const confirmations = await waitForTransaction(midlConfig, btcTx as string);

	// 	expect(confirmations).toBeGreaterThan(0);
	// });

	// test("complete tx", async ({ page, extensionId, context }) => {
	// 	await page.goto("http://localhost:5173", {
	// 		waitUntil: "networkidle",
	// 	});

	// 	const isConnected = await page.getByTestId("address").isVisible();

	// 	if (!isConnected) {
	// 		await page.getByTestId("connect").click();

	// 		await wallet.connectWallet({ context, extensionId });
	// 	}

	// 	await page
	// 		.getByTestId("address")
	// 		.waitFor({ state: "visible", timeout: 1_000 });

	// 	await page.getByTestId("complete-tx").click();

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(2000);

	// 	await wallet.acceptSign({ context, extensionId });

	// 	await page.waitForTimeout(500);

	// 	const btcTx = await page
	// 		.getByTestId("complete-tx-btc-tx")
	// 		.first()
	// 		.textContent();
	// 	const txId = await page
	// 		.getByTestId("complete-tx-tx-id")
	// 		.first()
	// 		.textContent();

	// 	console.log(`BTC tx: ${btcTx}`);
	// 	console.log(`Complete tx: ${txId}`);

	// 	console.log(
	// 		`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
	// 	);

	// 	const confirmations = await waitForTransaction(midlConfig, btcTx as string);

	// 	expect(confirmations).toBeGreaterThan(0);
	// });
});
