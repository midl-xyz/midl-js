import { initEccLib, networks, payments } from "bitcoinjs-lib";
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
import { AddressPurpose } from "~/constants";
import { extractXCoordinate, isCorrectAddress } from "~/utils";
import { getAddressPurpose } from "~/utils/getAddressPurpose";
import { makeAddress } from "~/utils/makeAddress";

class UnisatConnector implements Connector {
  public readonly id = "unisat";
  public readonly name = "Unisat";
  public readonly type = ConnectorType.Unisat;

  constructor(private config: CreateConnectorConfig) {}

  async getNetwork() {
    return this.config.getState().network;
  }

  async connect(params: ConnectParams): Promise<Account[]> {
    if (typeof window.unisat === "undefined") {
      throw new Error("Unisat not found");
    }

    const publicKey = await window.unisat.getPublicKey();
    const accounts = (await window.unisat.requestAccounts()).map(it => {
      return {
        address: it,
        publicKey: publicKey,
        purpose: getAddressPurpose(it, this.config.getState().network),
      };
    });

    const { purposes } = params;

    if (purposes.length > 0) {
      const missingPurpose = purposes.find(purpose => {
        return !accounts.find(account => account.purpose === purpose);
      });

      console.log("publicKey", publicKey);

      if (missingPurpose) {
        const address = await makeAddress(
          publicKey,
          missingPurpose,
          this.config.getState().network
        );

        if (!address) {
          throw new Error("Invalid address");
        }

        accounts.push({
          address,
          publicKey,
          purpose: missingPurpose,
        });
      }
    }

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

  async signPSBT({
    psbt,
    signInputs,
  }: SignPSBTParams): Promise<SignPSBTResponse> {
    if (typeof window.unisat === "undefined") {
      throw new Error("Unisat not found");
    }

    const toSignInputs = Object.keys(signInputs).flatMap(address =>
      signInputs[address].map(index => ({
        address,
        index,
      }))
    );

    const signature = await window.unisat.signPsbt(psbt, {
      autoFinalized: false,
      toSignInputs,
    });

    const base64Psbt = Buffer.from(signature, "hex").toString("base64");

    return {
      psbt: base64Psbt,
    };
  }
}

export const unisat = () => {
  return createConnector(config => {
    return new UnisatConnector(config);
  });
};
