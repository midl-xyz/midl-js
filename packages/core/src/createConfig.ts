import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { Account, Connector } from "~/connectors";
import { type AbstractProvider, MempoolSpaceProvider } from "~/providers";

export type BitcoinNetwork = {
	/**
	 * The id of the network
	 */
	id: "mainnet" | "testnet" | "testnet4" | "regtest";

	/**
	 * Bitcoin API used to generate addresses and sign transactions
	 */
	network: "bitcoin" | "testnet" | "regtest";
	/**
	 * The explorer URL for the network
	 */
	explorerUrl: string;
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
	persist?:
		| boolean
		| {
				enabled: boolean;
				storageKey?: string;
		  };

	/**
	 * The data provider to use
	 * @default MempoolSpaceProvider
	 */
	provider?: AbstractProvider;
};

export type ConfigState = {
	readonly network: BitcoinNetwork;
	readonly networks: BitcoinNetwork[];
	readonly connection?: Connector;
	readonly accounts?: Account[];
	readonly connectors: Connector[];
	readonly provider: AbstractProvider;
};

export type Config = ReturnType<typeof createConfig>;

export const createConfig = (params: ConfigParams) => {
	const [network] = params.networks;

	const shouldPersist =
		typeof params.persist === "boolean"
			? params.persist
			: params.persist?.enabled;

	const persistStorageKey =
		(typeof params.persist === "object"
			? params.persist.storageKey?.trim()
			: null) || "midl-js";

	const configStore = createStore<ConfigState>()(
		persist(
			() => ({
				networks: params.networks,
				connectors: params.connectors,
				network,
				provider: params.provider ?? new MempoolSpaceProvider(),
			}),
			{
				name: persistStorageKey,
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
								shouldPersist &&
								["network", "connection", "accounts"].includes(key),
						),
					),
				}),
			},
		),
	);

	return configStore;
};
