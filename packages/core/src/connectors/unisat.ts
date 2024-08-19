import {
  type SignMessageParams,
  SignMessageProtocol,
  type SignMessageResponse,
} from "~/actions";
import type { SignPSBTParams, SignPSBTResponse } from "~/actions/signPSBT";
import {
  type Account,
  type ConnectParams,
  type Connector,
  ConnectorType,
  type CreateConnectorConfig,
  createConnector,
} from "~/connectors/createConnector";
import { isCorrectAddress } from "~/utils";
import { getAddressPurpose } from "~/utils/getAddressPurpose";

class UnisatConnector implements Connector {
  public readonly id = "unisat";
  public readonly name = "Unisat";
  public readonly type = ConnectorType.Unisat;

  constructor(private config: CreateConnectorConfig) {}

  async getNetwork() {
    return this.config.getState().network;
  }

  async connect(_params: ConnectParams): Promise<Account[]> {
    if (typeof window.unisat === "undefined") {
      throw new Error("Unisat not found");
    }

    const publicKey = await window.unisat.getPublicKey();
    const accounts = (await window.unisat.requestAccounts()).map(it => {
      return {
        address: it,
        publicKey: it,
        purpose: getAddressPurpose(it, this.config.getState().network),
      };
    });

    this.config.setState({
      connection: this.id,
      publicKey: publicKey,
      accounts,
    });

    return accounts;
  }

  async disconnect() {
    this.config.setState({
      connection: undefined,
      publicKey: undefined,
    });
  }

  async getAccounts() {
    if (!this.config.getState().connection) {
      throw new Error("Not connected");
    }

    if (!this.config.getState().accounts) {
      throw new Error("No accounts");
    }

    for (const account of this.config.getState().accounts as Account[]) {
      if (!isCorrectAddress(account.address, this.config.getState().network)) {
        throw new Error("Invalid address network");
      }
    }

    return this.config.getState().accounts as Account[];
  }

  async signMessage(params: SignMessageParams): Promise<SignMessageResponse> {
    if (typeof window.unisat === "undefined") {
      throw new Error("Unisat not found");
    }

    let type: "ecdsa" | "bip322-simple" = "ecdsa";

    switch (params.protocol) {
      case SignMessageProtocol.Ecdsa:
        type = "ecdsa";
        break;
      default:
        type = "ecdsa";
        break;
    }

    const signature = await window.unisat.signMessage(params.message, type);

    return {
      signature,
      address: params.address,
    };
  }

  async signPSBT(params: SignPSBTParams): Promise<SignPSBTResponse> {
    if (typeof window.unisat === "undefined") {
      throw new Error("Unisat not found");
    }

    const signature = await window.unisat.signPsbt(params.psbt);

    return {
      psbt: signature,
    };
  }
}

export const unisat = () => {
  return createConnector(config => {
    return new UnisatConnector(config);
  });
};
