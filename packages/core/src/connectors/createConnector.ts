import type { MetaMaskInpageProvider } from "@metamask/providers";
import type { BitcoinNetwork, ConfigAtom } from "~/createConfig";

type Account = {
  readonly address: string;
  readonly publicKey: string;
};

export type Connector = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  provider(): Promise<MetaMaskInpageProvider>;
  connect(): Promise<Account>;
  disconnect(): Promise<void>;
  getAccount(): Promise<Account>;
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
