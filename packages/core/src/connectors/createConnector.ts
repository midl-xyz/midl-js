import type { BitcoinNetwork, Config, ConfigAtom } from "~/createConfig";

type Account = {
  readonly address: string;
  readonly publicKey: string;
};

export type Connector = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  connect(): Promise<Account>;
  disconnect(): Promise<void>;
  getAccount(): Account;
  getNetwork(): Promise<BitcoinNetwork>;
};

export type CreateConnectorFn = (config: {
  network: BitcoinNetwork;
  setState: (state: Partial<ConfigAtom>) => void;
  getState: () => ConfigAtom;
}) => Connector;

export const createConnector = (createConnectorFn: CreateConnectorFn) => {
  return createConnectorFn;
};
