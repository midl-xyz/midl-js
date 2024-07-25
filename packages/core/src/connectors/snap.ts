import { type Connector, createConnector } from "~/connectors";

export const snap = () => {
  const targetMap = {
    midlBTCSnap: {
      id: "midlBTCSnap",
      name: "MIDL BTC Snap",
      provider() {},
    },
    // add other injectable connectors here
  };

  return createConnector(({ network }) => {
    return {
      name: "MIDL BTC Snap",
    } as Connector;
  });
};
