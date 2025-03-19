import { createJSONStorage, persist } from "zustand/middleware";
import { type StoreApi, createStore } from "zustand/vanilla";
import type { Account, Connector } from "~/connectors";

export type BitcoinNetwork = {
	/**
	 * The id of the network
	 */
	id: string;
	/**
	 * Bitcoin API used to generate addresses and sign transactions
	 */
	network: "bitcoin" | "testnet" | "regtest";
	/**
	 * The RPC URL for the network
	 */
	rpcUrl: string;
	/**
	 * Runes API URL
	 */
	runesUrl: string;
	/**
	 * The explorer URL for the network
	 */
	explorerUrl: string;
	/**
	 * The runes UTXO API URL
	 */
	runesUTXOUrl: string;
};

type ConfigParams = {
	/**
	 * The bitcoin networks to use
	 */
	networks: BitcoinNetwork[];
	/**
	 * The connectors to use
	 */
	connectors: Connector[];
	/**
	 * If true, the config will persist in local storage
	 */
	persist?: boolean;
};

export type ConfigState = {
	readonly network: BitcoinNetwork;
	readonly networks: BitcoinNetwork[];
	readonly connection?: Connector;
	readonly accounts?: Account[];
	readonly connectors: Connector[];
};

export type Config = StoreApi<ConfigState>;

export const createConfig = (params: ConfigParams) => {
	const [network] = params.networks;

	const configStore = createStore<ConfigState>()(
		persist(
			() => ({
				network,
				networks: params.networks,
				connectors: params.connectors,
			}),
			{
				name: "midl-js",
				storage: createJSONStorage(() => localStorage, {
					reviver(key, value) {
						if (key === "connection") {
							return (value as ConfigState["connection"])?.id;
						}

						return value;
					},
					replacer(key, value) {
						if (key === "connection") {
							return params.connectors.find((it) => it.id === value);
						}

						return value;
					},
				}),
				partialize: (state: ConfigState) => ({
					...Object.fromEntries(
						Object.entries(state).filter(
							([key]) =>
								params.persist &&
								["network", "connection", "accounts"].includes(key),
						),
					),
				}),
			},
		),
	);

	const state = configStore.getState();

	const networkToUse =
		params.networks.find((n) => n.id === state?.network?.id) ||
		params.networks[0];

	configStore.setState({
		...state,
		network: networkToUse,
	});

	return configStore;
};
