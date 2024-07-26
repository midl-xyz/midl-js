import { createConnector } from "~/connectors/createConnector";
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
      provider() {
        return discoverSnapsProvider();
      },
    },
  };

  const getTarget = () => {
    return targetMap[target];
  };

  const { id, name, provider, snap } = getTarget();

  return createConnector(config => {
    return {
      get id() {
        return id;
      },
      get name() {
        return name;
      },
      get type() {
        return "snap";
      },
      async connect() {
        const snapProvider = await provider();

        const data = await snapProvider.request({
          method: "wallet_requestSnaps",
          params: {
            [snap.id]: snap.version ? { version: snap.version } : {},
          },
        });

        config.setState({
          installedSnap: data,
        });
      },
      async disconnect() {
        config.setState({
          installedSnap: undefined,
        });
      },
      async getAccounts() {
        throw new Error("Not implemented");
      },
      async getNetwork() {
        return config.getState().network;
      },
    };
  });
};
