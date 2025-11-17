import {
	type BitcoinNetwork,
	mainnet,
	regtest,
	signet,
	testnet,
	testnet4,
} from "@midl/core";

export const multisigAddress: Record<BitcoinNetwork["id"], string> = {
	[testnet4.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[testnet.id]: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
	[regtest.id]: "bcrt1q65a572l6n7vqqpqpvnrcxps8205fuzcfr0gmew",
	[signet.id]: "",
	[mainnet.id]: "",
};

export const SystemContracts = {
	ValidatorRegistry: "0x0000000000000000000000000000000000001000",
	Staking: "0x0000000000000000000000000000000000001001",
	MidlToken: "0x0000000000000000000000000000000000001002",
	Executor: "0x0000000000000000000000000000000000001003",
	ExecutorL2: "0x0000000000000000000000000000000000001004",
	SynthReservoir: "0x0000000000000000000000000000000000001005",
	GlobalParams: "0x0000000000000000000000000000000000001006",
	FeesDistributor: "0x0000000000000000000000000000000000001007",
	Treasury: "0x0000000000000000000000000000000000001008",
} as const;
