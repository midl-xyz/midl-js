import deployment from "@midl/contracts/deployments/0.1.1/Executor.json";
import {
	type BitcoinNetwork,
	mainnet,
	regtest,
	signet,
	testnet,
	testnet4,
} from "@midl/core";
import type { Address } from "viem";

export const multisigAddress: Record<BitcoinNetwork["id"], string> = {
	[testnet4.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[testnet.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[regtest.id]: "bcrt1q65a572l6n7vqqpqpvnrcxps8205fuzcfr0gmew",
	[signet.id]: "",
	[mainnet.id]: "",
};

export const executorAddress: Record<BitcoinNetwork["id"], Address> = {
	[regtest.id]: deployment.address as Address,
	[signet.id]: deployment.address as Address,
	[testnet.id]: deployment.address as Address,
	[testnet4.id]: deployment.address as Address,
	[mainnet.id]: deployment.address as Address,
};
