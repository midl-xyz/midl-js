import deployment from "@midl/contracts/deployments/0.1.1/Executor.json";
import { regtest, signet, testnet, testnet4 } from "@midl/core";

export const multisigAddress = {
	[testnet4.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[testnet.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[regtest.id]: "bcrt1q65a572l6n7vqqpqpvnrcxps8205fuzcfr0gmew",
	[signet.id]: "",
};

export const executorAddress = {
	[regtest.id]: deployment.address,
	[signet.id]: deployment.address,
};
