import type { SignMessageParams, SignMessageResponse } from "~/actions";
import type { SignPSBTParams, SignPSBTResponse } from "~/actions/signPSBT";
import type { AddressPurpose, AddressType } from "~/constants";
import type { BitcoinNetwork, ConfigAtom } from "~/createConfig";

export type Account = {
  readonly address: string;
  readonly publicKey: string;
  readonly purpose: AddressPurpose;
  readonly addressType: AddressType;
};

export enum ConnectorType {
  Snap = "snap",
  Unisat = "unisat",
  SatsConnect = "satsConnect",
  Leather = "leather",
}

export type ConnectParams = {
  purposes: AddressPurpose[];
};

export interface Connector {
  readonly id: string;
  readonly name: string;
  connect(params: ConnectParams): Promise<Account[]>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<Account[]>;
  getNetwork(): Promise<BitcoinNetwork>;
  signMessage(params: SignMessageParams): Promise<SignMessageResponse>;
  signPSBT(
    params: Omit<SignPSBTParams, "publish">
  ): Promise<Omit<SignPSBTResponse, "txId">>;
}

export type CreateConnectorConfig = {
  network: BitcoinNetwork;
  setState: (state: Partial<ConfigAtom>) => void;
  getState: () => ConfigAtom;
};

export type CreateConnectorFn = (config: CreateConnectorConfig) => Connector;

export const createConnector = (createConnectorFn: CreateConnectorFn) => {
  return createConnectorFn;
};
