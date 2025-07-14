import deployment from "@midl-xyz/contracts/deployments/0.1.1/Executor.json";
import { regtest, testnet, testnet4 } from "@midl-xyz/midl-js-core";

export const multisigAddress = {
	[testnet4.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[testnet.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[regtest.id]: "bcrt1q65a572l6n7vqqpqpvnrcxps8205fuzcfr0gmew",
};

export const executorAddress = {
	[regtest.id]: deployment.address,
};
