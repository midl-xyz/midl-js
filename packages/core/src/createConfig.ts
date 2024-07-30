import { createStore, type PrimitiveAtom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";
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
  persist?: boolean;
};

export type Config = {
  readonly networks: BitcoinNetwork[];
  readonly chain: EVMChain;
  readonly connectors: Connector[];
  readonly network: BitcoinNetwork | undefined;
  setState(state: ConfigAtom): void;
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
};

const configStore = createStore();

export const createConfig = (params: ConfigParams): Config => {
  const [network] = params.networks;

  const configAtom = params.persist
    ? atomWithStorage<ConfigAtom>("midl-js", {
        network,
      } as ConfigAtom)
    : atomWithReset<ConfigAtom>({
        network,
      } as ConfigAtom);

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
