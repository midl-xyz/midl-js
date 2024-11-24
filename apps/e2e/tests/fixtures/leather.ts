import type { Page } from "@playwright/test";
import type { TestArgs } from "~/fixtures/test";
import type { Wallet } from "~/fixtures/wallet";

export const leather: Wallet = {
	isWalletLocked: (args) => {
		throw new Error("Function not implemented.");
	},
	unlockWallet: (args) => {
		throw new Error("Function not implemented.");
	},
	configureWallet: (args: {
		page: Page;
		extensionId: string;
	}): Promise<void> => {
		throw new Error("Function not implemented.");
	},
	changeNetwork: (
		{ page, extensionId }: { page: Page; extensionId: string },
		networkName: string,
	): Promise<void> => {
		throw new Error("Function not implemented.");
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
