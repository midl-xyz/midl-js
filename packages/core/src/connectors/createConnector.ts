import type { BitcoinNetwork, ConfigAtom } from "~/createConfig";

type Account = {
  readonly address: string;
  readonly publicKey: string;
};

export enum ConnectorType {
  Snap = "snap",
  SatsConnect = "satsConnect",
}

export type Connector = {
  readonly id: string;
  readonly name: string;
  readonly type: ConnectorType;
  connect(): Promise<Account[]>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<Account[]>;
  getNetwork(): Promise<BitcoinNetwork>;
  request(data: unknown): unknown;
};

export type CreateConnectorFn = (config: {
  network: BitcoinNetwork;
  setState: (state: Partial<ConfigAtom>) => void;
  getState: () => ConfigAtom;
}) => Connector;

export const createConnector = (createConnectorFn: CreateConnectorFn) => {
  return createConnectorFn;
};
