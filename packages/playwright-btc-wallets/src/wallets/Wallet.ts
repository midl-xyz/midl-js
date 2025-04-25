import type { BrowserContext, Page } from "@playwright/test";
import { mainnet, regtest, testnet, testnet4 } from "@midl-xyz/midl-js-core";

export const supportedNetworks = {
	mainnet,
	regtest,
	testnet,
	testnet4,
} as const;

export type NetworkName = keyof typeof supportedNetworks;

export abstract class Wallet {
	constructor(
		protected readonly context: BrowserContext,
		protected readonly extensionId: string,
		protected readonly mnemonic: string,
		protected readonly password: string,
	) {}

	async configure(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async unlock(page?: Page): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async isLocked(page: Page): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	async changeNetwork(networkName: NetworkName): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async connect(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async confirmSignature(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async confirmTransaction(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async cancelSignature(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async cancelTransaction(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async getPage(): Promise<Page> {
		return new Promise<Page>((resolve) => {
			const onNewPage = async (page: Page) => {
				if (page.url().includes(this.extensionId)) {
					resolve(page);
				}

				this.context.off("page", onNewPage);
			};

			for (const page of this.context.pages()) {
				if (page.url().includes(this.extensionId)) {
					resolve(page);
					return;
				}
			}

			this.context.on("page", onNewPage);
		});
	}
}

export type WalletConstructor = new (
	...args: ConstructorParameters<typeof Wallet>
) => Wallet;
