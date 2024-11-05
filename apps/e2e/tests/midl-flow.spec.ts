import { expect, test } from "~/fixtures/test";
import {
	acceptSign,
	changeNetwork,
	closeAutoOpenedExtensionTab,
	configureWallet,
	connectWallet,
} from "~/fixtures/unisat";
import midlConfig from "../app/midl.config";
import { waitForTransaction } from "@midl-xyz/midl-js-core";
import { zeroAddress } from "viem";

midlConfig.setState({ network: midlConfig.networks[0] });

test.describe("Add Liquidity Flow", () => {
	test.describe.configure({ mode: "serial" });

	let runeAddress: string | null;

	test.beforeAll(async ({ page, extensionId, context }) => {
		await closeAutoOpenedExtensionTab({ context, extensionId });
		await configureWallet({ page, extensionId });
		await changeNetwork({ page, extensionId }, "Bitcoin Testnet4");
	});

	test.beforeEach(async ({ context, extensionId }) => {
		await closeAutoOpenedExtensionTab({ context, extensionId });
	});

	test("edict rune", async ({ page, extensionId, context }) => {
		await page.goto("http://localhost:5173", {
			waitUntil: "networkidle",
		});

		const isConnected = await page.getByTestId("address").isVisible();

		if (!isConnected) {
			await page.getByTestId("connect").click();

			await connectWallet({ page, context, extensionId });
		}

		await page
			.getByTestId("address")
			.waitFor({ state: "visible", timeout: 1_000 });

		runeAddress = await page.getByTestId("edict-address").first().textContent();

		if (!runeAddress || runeAddress === zeroAddress) {
			await page.getByTestId("edict").click();

			await acceptSign({ page, context, extensionId });

			await page.waitForTimeout(500);

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
		}

		console.log(`Rune edict at: ${runeAddress}`);
	});

	test("add liquidity", async ({ page, extensionId, context }) => {
		await page.goto("http://localhost:5173", {
			waitUntil: "networkidle",
		});

		const isConnected = await page.getByTestId("address").isVisible();

		if (!isConnected) {
			await page.getByTestId("connect").click();

			await connectWallet({ page, context, extensionId });
		}

		await page
			.getByTestId("address")
			.waitFor({ state: "visible", timeout: 1_000 });

		await page.getByTestId("add-liquidity").click();

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(2000);

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(2000);

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(500);

		const btcTx = await page
			.getByTestId("add-liquidity-btc-tx")
			.first()
			.textContent();
		const approveTx = await page
			.getByTestId("add-liquidity-approve-tx")
			.first()
			.textContent();
		const addLiquidityTx = await page
			.getByTestId("add-liquidity-add-liquidity-tx")
			.first()
			.textContent();

		console.log(`BTC tx: ${btcTx}`);
		console.log(`Approve tx: ${approveTx}`);
		console.log(`Add liquidity tx: ${addLiquidityTx}`);

		console.log(
			`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
		);

		const confirmations = await waitForTransaction(midlConfig, btcTx as string);

		expect(confirmations).toBeGreaterThan(0);
	});

	test("swap", async ({ page, extensionId, context }) => {
		await page.goto("http://localhost:5173", {
			waitUntil: "networkidle",
		});

		const isConnected = await page.getByTestId("address").isVisible();

		if (!isConnected) {
			await page.getByTestId("connect").click();

			await connectWallet({ page, context, extensionId });
		}

		await page
			.getByTestId("address")
			.waitFor({ state: "visible", timeout: 1_000 });

		await page.getByTestId("swap").click();

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(2000);

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(500);

		const btcTx = await page.getByTestId("swap-btc-tx").first().textContent();
		const txId = await page.getByTestId("swap-tx-id").first().textContent();

		console.log(`BTC tx: ${btcTx}`);
		console.log(`Swap tx: ${txId}`);

		console.log(
			`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
		);

		const confirmations = await waitForTransaction(midlConfig, btcTx as string);

		expect(confirmations).toBeGreaterThan(0);
	});

	test("complete tx", async ({ page, extensionId, context }) => {
		await page.goto("http://localhost:5173", {
			waitUntil: "networkidle",
		});

		const isConnected = await page.getByTestId("address").isVisible();

		if (!isConnected) {
			await page.getByTestId("connect").click();

			await connectWallet({ page, context, extensionId });
		}

		await page
			.getByTestId("address")
			.waitFor({ state: "visible", timeout: 1_000 });

		await page.getByTestId("complete-tx").click();

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(2000);

		await acceptSign({ page, context, extensionId });

		await page.waitForTimeout(500);

		const btcTx = await page
			.getByTestId("complete-tx-btc-tx")
			.first()
			.textContent();
		const txId = await page
			.getByTestId("complete-tx-tx-id")
			.first()
			.textContent();

		console.log(`BTC tx: ${btcTx}`);
		console.log(`Complete tx: ${txId}`);

		console.log(
			`waiting for transaction: ${midlConfig.network?.explorerUrl}/tx/${btcTx}`,
		);

		const confirmations = await waitForTransaction(midlConfig, btcTx as string);

		expect(confirmations).toBeGreaterThan(0);
	});
});
