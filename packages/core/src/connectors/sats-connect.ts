import {
  type Account,
  ConnectorType,
  createConnector,
} from "~/connectors/createConnector";
import Wallet, { AddressPurpose } from "sats-connect";
import { regtest } from "~/networks";

export const satsConnect = () => {
  return createConnector(config => {
    return {
      id: "sats-connect",
      name: "Sats Connect",
      type: ConnectorType.SatsConnect,
      async getNetwork() {
        return regtest;
      },

      request: async ({
        method,
        params,
      }: {
        method: Parameters<typeof Wallet.request>[0];
        params: Parameters<typeof Wallet.request>[1];
      }) => {
        return Wallet.request(method, params);
      },
      connect: async ({ purposes }) => {
        const data = await Wallet.request("getAccounts", {
          purposes,
        });

        if (data.status === "error") {
          throw data.error;
        }

        config.setState({
          connection: "sats-connect",
          publicKey: data.result[0].publicKey,
        });

        return data.result.map(
          ({ walletType, ...account }) => account
        ) as Account[];
      },
      disconnect: async () => {
        await Wallet.request("wallet_renouncePermissions", undefined);

        config.setState({
          connection: undefined,
          publicKey: undefined,
        });
      },
      getAccounts: async () => {
        if (!config.getState().connection) {
          throw new Error("Not connected");
        }

        const data = await Wallet.request("getAddresses", {
          purposes: [AddressPurpose.Payment],
        });

        if (data.status === "error") {
          throw data.error;
        }

        return data.result.addresses as Account[];
      },
    };
  });
};
