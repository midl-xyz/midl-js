import { type Config, getDefaultAccount } from "@midl-xyz/midl-js-core";
import type { TransactionSerializableBTC } from "viem";
import type { TransactionIntention } from "~/types/intention";
import { getEVMAddress } from "~/utils";

export type PartialIntention = Omit<
	TransactionIntention,
	"evmTransaction" | "signedEvmTransaction"
> & {
	evmTransaction?: Omit<TransactionIntention["evmTransaction"], "chainId"> & {
		chainId?: TransactionSerializableBTC["chainId"];
	};
};

/**
 * Creates a transaction intention with the provided parameters.
 *
 * @param config The configuration object
 * @param intention The intention to add
 * @param reset If true, the intentions array will be reset
 * @param from The BTC address to use for the intention
 * @returns The added intention
 */
export const addTxIntention = async (
	config: Config,
	intention: PartialIntention,
	from?: string,
): Promise<TransactionIntention> => {
	const account = getDefaultAccount(
		config,
		from ? (it) => it.address === from : undefined,
	);

	if (!account) {
		throw new Error("No account found for public key");
	}

	const evmAddress = getEVMAddress(account, config.getState().network);

	if (intention.evmTransaction) {
		intention.evmTransaction.from = intention.evmTransaction.from ?? evmAddress;
	}

	return intention as TransactionIntention;
};
