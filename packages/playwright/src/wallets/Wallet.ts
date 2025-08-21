import { mainnet, regtest, signet, testnet, testnet4 } from "@midl/core";
import type { BrowserContext, Page } from "@playwright/test";

export const supportedNetworks = {
	mainnet,
	regtest,
	testnet,
	testnet4,
	signet,
} as const;

export type NetworkName = keyof typeof supportedNetworks;

export abstract class Wallet {
	constructor(
		protected readonly context: BrowserContext,
		protected readonly extensionId: string,
		protected readonly mnemonic: string,
		protected readonly password: string,
		protected readonly rpcUrls: Record<NetworkName, string> = {
			mainnet: "https://mempool.midl.xyz/api",
			regtest: "https://mempool.regtest.midl.xyz/api",
			testnet: "https://mempool.testnet.midl.xyz/api",
			testnet4: "https://mempool.testnet4.midl.xyz/api",
			signet: "https://mempool.space/signet/api",
		},
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

	async getPage(filter?: (page: Page) => Promise<boolean>): Promise<Page> {
		return new Promise<Page>((resolve) => {
			const onNewPage = async (page: Page) => {
				if (page.url().includes(this.extensionId)) {
					if (filter) {
						const isValid = await filter(page);
						if (!isValid) return;
					}
					resolve(page);
				}

				this.context.off("page", onNewPage);
			};

			for (const page of this.context.pages()) {
				if (page.url().includes(this.extensionId) && !page.isClosed()) {
					if (filter) {
						const isValid = filter(page);
						if (!isValid) return;
					}
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
