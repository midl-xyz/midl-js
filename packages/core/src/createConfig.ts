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

	// hasHydrated: boolean;
	// setHasHydrated: (state: boolean) => void;
};

export type Config = ReturnType<typeof createConfig>;

export const createConfig = (params: ConfigParams) => {
	const [network] = params.networks;

	const configStore = createStore<ConfigState>()(
		persist(
			() => ({
				networks: params.networks,
				connectors: params.connectors,
				network,
			}),
			{
				name: "midl-js",
				storage: createJSONStorage(() => localStorage, {
					reviver(key, value) {
						if (key === "connection") {
							return params.connectors.find((it) => it.id === value);
						}

						if (key === "network") {
							return (
								params.networks.find((it) => it.id === value) ??
								params.networks[0]
							);
						}

						return value;
					},
					replacer(key, value) {
						if (key === "connection") {
							return (value as ConfigState["connection"])?.id;
						}

						if (key === "network") {
							return (value as ConfigState["network"])?.id;
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

	return configStore;
};
