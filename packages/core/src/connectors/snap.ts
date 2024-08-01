import type {
  MetaMaskInpageProvider,
  RequestArguments,
} from "@metamask/providers";
import { ConnectorType, createConnector } from "~/connectors/createConnector";
import { discoverSnapsProvider } from "~/connectors/discoverSnapsProvider";

type SnapParams = {
  target: "midlBTCSnap";
};

export const snap = (
  { target }: SnapParams = {
    target: "midlBTCSnap",
  }
) => {
  const targetMap = {
    midlBTCSnap: {
      id: "midlBTCSnap",
      name: "MIDL BTC Snap",
      type: "snap",
      snap: {
        id: "local:http://localhost:8080",
        version: undefined,
      },
      provider: (() => {
        let mmProvider: MetaMaskInpageProvider | undefined;

        return async () => {
          if (mmProvider) {
            return mmProvider;
          }

          mmProvider = await discoverSnapsProvider();

          return mmProvider;
        };
      })(),
    },
  };

  const getTarget = () => {
    return targetMap[target];
  };

  const { id, name, provider, snap } = getTarget();

  const requestPublicKey = async (): Promise<string> => {
    const snapProvider = await provider();

    return (await snapProvider.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: snap.id,
        request: {
          method: "getAccounts",
          params: {},
        },
      },
    })) as string;
  };

  return createConnector(config => {
    return {
      get id() {
        return id;
      },
      get name() {
        return name;
      },
      get type() {
        return ConnectorType.Snap;
      },
      async request(request: RequestArguments) {
        const snapProvider = await provider();
        return snapProvider.request(request);
      },
      async connect() {
        const snapProvider = await provider();

        const data = (await snapProvider.request({
          method: "wallet_requestSnaps",
          params: {
            [snap.id]: snap.version ? { version: snap.version } : {},
          },
        })) as GetSnapsResponse;

        const publicKey = await requestPublicKey();

        config.setState({
          installedSnap: data[snap.id],
          publicKey,
          connection: this.id,
        });

        return this.getAccounts();
      },
      async disconnect() {
        config.setState({
          installedSnap: undefined,
          publicKey: undefined,
          connection: undefined,
        });
      },
      async getAccounts() {
        const publicKey = await requestPublicKey();
        // TODO: generate the address from the public key
        return [
          {
            publicKey: publicKey.startsWith("0x")
              ? publicKey.slice(2)
              : publicKey,
            address: publicKey,
          },
        ];
      },
      async getNetwork() {
        return config.getState().network;
      },
    };
  });
};
