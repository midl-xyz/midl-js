import { createJSONStorage, persist } from "zustand/middleware";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { Account, Connector, CreateConnectorFn } from "~/connectors";

export type BitcoinNetwork = {
	id: string;
	network: "bitcoin" | "testnet" | "regtest";
	rpcUrl: string;
	runesUrl: string;
	explorerUrl: string;
	runesUTXOUrl: string;
};

type ConfigParams = {
	networks: BitcoinNetwork[];
	connectors: CreateConnectorFn[];
	persist?: boolean;
};

export type Config = {
	readonly networks: BitcoinNetwork[];
	readonly connectors: Connector[];
	readonly network: BitcoinNetwork | undefined;
	readonly currentConnection?: Connector;
	setState(state: Partial<ConfigState>): void;
	getState(): ConfigState;
	subscribe(callback: (newState: ConfigState | undefined) => void): () => void;
	_internal: {
		configStore: StoreApi<ConfigState>;
	};
};

export type ConfigState = {
	readonly network: BitcoinNetwork;
	readonly publicKey?: string;
	readonly connection?: string;
	readonly accounts?: Account[];
};

const configStore = createStore();

export const createConfig = (params: ConfigParams): Config => {
	const [network] = params.networks;

	const configStore = params.persist
		? createStore<ConfigState>()(
				persist(
					(set, get) => ({
						network,
					}),
					{
						name: "midl-js",
						storage: createJSONStorage(() => localStorage),
					},
				),
			)
		: createStore<ConfigState>()(() => ({
				network,
			}));

	const state = configStore.getState();

	const networkToUse =
		params.networks.find((n) => n.id === state?.network.id) ||
		params.networks[0];

	configStore.setState({
		...state,
		network: networkToUse,
	});

	const connectors = params.connectors.map((createConnectorFn) =>
		createConnectorFn({
			network,
			setState: configStore.setState,
			getState: configStore.getState,
		}),
	);

	return {
		networks: params.networks,
		get network() {
			return configStore.getState().network;
		},
		setState: configStore.setState,
		connectors,
		subscribe: configStore.subscribe,
		getState: configStore.getState,
		get currentConnection() {
			return this.connectors.find(
				(connector) => connector.id === configStore.getState().connection,
			);
		},
		_internal: {
			configStore,
		},
	};
};
