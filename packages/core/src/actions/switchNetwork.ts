import type { BitcoinNetwork, Config } from "~/createConfig";

export const switchNetwork = async (
  config: Config,
  network: BitcoinNetwork
) => {
  const supportedNetworks = config.networks;
  if (!supportedNetworks.includes(network)) {
    throw new Error(`Network ${network} is not supported`);
  }

  config.setState({
    network,
  });
};
