import { atom, createStore } from "jotai";
import type { Connector, CreateConnectorFn } from "~/connectors";

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
};

export type Config = {
  readonly networks: BitcoinNetwork[];
  readonly chain: EVMChain;
  readonly connectors: Connector[];
  readonly network: BitcoinNetwork | undefined;
  setState(state: ConfigAtom): void;
  subscribe(callback: (newState: ConfigAtom | undefined) => void): () => void;
  _internal: {
    configAtom: typeof configAtom;
    configStore: typeof configStore;
  };
};

export type ConfigAtom = {
  readonly network: BitcoinNetwork;
  readonly installedSnap?: unknown;
};

const configStore = createStore();
const configAtom = atom<ConfigAtom>();

export const createConfig = (params: ConfigParams): Config => {
  const [network] = params.networks;

  configStore.set(configAtom, { network });

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
    _internal: {
      configAtom,
      configStore,
    },
  };
};
