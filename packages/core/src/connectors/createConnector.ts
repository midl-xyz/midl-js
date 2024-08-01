import type { AddressPurpose } from "~/constants";
import type { BitcoinNetwork, ConfigAtom } from "~/createConfig";

export type Account = {
  readonly address: string;
  readonly publicKey: string;
  readonly purpose: AddressPurpose;
  readonly addressType: string;
};

export enum ConnectorType {
  Snap = "snap",
  SatsConnect = "satsConnect",
}

export type ConnectParams = {
  purposes: AddressPurpose[];
};

export type Connector = {
  readonly id: string;
  readonly name: string;
  readonly type: ConnectorType;
  connect(params: ConnectParams): Promise<Account[]>;
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
