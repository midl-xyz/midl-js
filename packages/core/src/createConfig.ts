import { createStore, type PrimitiveAtom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
import type { Account, Connector, CreateConnectorFn } from "~/connectors";

export type BitcoinNetwork = {
  network: "bitcoin" | "testnet" | "regtest";
  rpcUrl: string;
};

export type EVMChain = {
  chainId: number;
  rpcUrls: string[];
  name?: string;
  blockExplorerUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  iconUrls?: string[];
};

type ConfigParams = {
  networks: BitcoinNetwork[];
  chain: EVMChain;
  connectors: CreateConnectorFn[];
  persist?: boolean;
};

export type Config = {
  readonly networks: BitcoinNetwork[];
  readonly chain: EVMChain;
  readonly connectors: Connector[];
  readonly network: BitcoinNetwork | undefined;
  readonly currentConnection?: Connector;
  setState(state: Partial<ConfigAtom>): void;
  getState(): ConfigAtom;
  subscribe(callback: (newState: ConfigAtom | undefined) => void): () => void;
  _internal: {
    configAtom: PrimitiveAtom<ConfigAtom>;
    configStore: typeof configStore;
  };
};

export type ConfigAtom = {
  readonly network: BitcoinNetwork;
  readonly installedSnap?: GetSnapsResponse[string];
  readonly publicKey?: string;
  readonly connection?: string;
  readonly accounts?: Account[];
};

const configStore = createStore();

export const createConfig = (params: ConfigParams): Config => {
  const [network] = params.networks;

  const configAtom = params.persist
    ? atomWithStorage<ConfigAtom>(
        "midl-js",
        {
          network,
        } as ConfigAtom,
        undefined,
        { getOnInit: true }
      )
    : atomWithReset<ConfigAtom>({
        network,
      } as ConfigAtom);

  const state = configStore.get(configAtom);
  if (!params.networks.includes(state?.network)) {
    configStore.set(configAtom, {
      ...state,
      network,
    });
  }

  const connectors = params.connectors.map(createConnectorFn =>
    createConnectorFn({
      network,
      setState: (state: Partial<ConfigAtom>) => {
        configStore.set(configAtom, {
          ...(configStore.get(configAtom) || ({} as ConfigAtom)),
          ...state,
        });
      },
      getState: () => configStore.get(configAtom) as ConfigAtom,
    })
  );

  return {
    networks: params.networks,
    chain: params.chain,
    get network() {
      return configStore.get(configAtom)?.network;
    },
    setState: (state: ConfigAtom) => {
      configStore.set(configAtom, state);
    },
    connectors,
    subscribe: (callback: (newState: ConfigAtom | undefined) => void) => {
      return configStore.sub(configAtom, () => {
        callback(configStore.get(configAtom));
      });
    },
    getState: () => configStore.get(configAtom),
    get currentConnection() {
      return this.connectors.find(
        connector => connector.id === configStore.get(configAtom)?.connection
      );
    },
    _internal: {
      configAtom,
      configStore,
    },
  };
};
