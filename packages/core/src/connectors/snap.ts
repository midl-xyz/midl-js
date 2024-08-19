import type { MetaMaskInpageProvider } from "@metamask/providers";
import { createConnector } from "~/connectors/createConnector";
import { discoverSnapsProvider } from "~/connectors/discoverSnapsProvider";

type SnapParams = {
  target: "btcSnap";
};

// class BTCSnapConnector implements Connector {}

export const snap = (
  { target }: SnapParams = {
    target: "btcSnap",
  }
) => {
  const targetMap = {
    btcSnap: {
      id: "btcSnap",
      name: "BTC Snap",
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

  return createConnector(config => {
    throw new Error("Not implemented");
  });
};
