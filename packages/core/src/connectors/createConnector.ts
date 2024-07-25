import type { BitcoinNetwork, ConfigAtom } from "~/createConfig";

export type Connector = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<string[]>;
  getNetwork(): Promise<BitcoinNetwork>;
};

export type CreateConnectorFn = (config: ConfigAtom) => Connector;

export const createConnector = (createConnectorFn: CreateConnectorFn) => {
  return createConnectorFn;
};
