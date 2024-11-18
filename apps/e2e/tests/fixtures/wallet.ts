import type { Page } from "@playwright/test";
import type { TestArgs } from "~/fixtures/test";

type CommonArgs = Pick<TestArgs, "page" | "extensionId">;

export interface Wallet {
	isWalletLocked(args: Pick<CommonArgs, "page">): Promise<boolean>;
	unlockWallet(
		args: Pick<CommonArgs, "page"> & {
			skipNavigation?: boolean;
		},
	): Promise<void>;
	configureWallet: (args: CommonArgs) => Promise<void>;
	changeNetwork: (
		{ page, extensionId }: CommonArgs,
		networkName: string,
	) => Promise<void>;
	connectWallet({
		context,
		extensionId,
	}: Pick<TestArgs, "context" | "extensionId">): Promise<void>;
	acceptSign({
		context,
		extensionId,
	}: Pick<TestArgs, "context" | "extensionId">): Promise<void>;
}

export const closeAutoOpenedExtensionTab = async ({
	context,
	extensionId,
}: Pick<TestArgs, "context" | "extensionId">) => {
	return new Promise<void>((resolve) => {
		const onNewPage = async (page: Page) => {
			if (page.url().includes(extensionId)) {
				await page.close();
				context.off("page", onNewPage);
				resolve();
			}
		};

		context.on("page", onNewPage);
	});
};

const wallets = {
	unisat: (await import("./unisat")).unisat,
	leather: (await import("./leather")).leather,
};

export const getWallet = (
	walletName: "leather" | "unisat" = process.env.EXTENSION as
		| "leather"
		| "unisat",
): Wallet => {
	return wallets[walletName] as Wallet;
};
