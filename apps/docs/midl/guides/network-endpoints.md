---
order: 0
title: "Network Endpoints"
---

# Network Endpoints

All the URLs and identifiers you need for developing on the MIDL **regtest/staging** network.

## Endpoints

| Service | URL |
|---------|-----|
| EVM RPC | `https://rpc.staging.midl.xyz` |
| Bitcoin Explorer (Mempool) | `https://mempool.staging.midl.xyz` |
| EVM Explorer (Blockscout) | `https://blockscout.staging.midl.xyz` |
| Runes API | `https://runes.staging.midl.xyz` |
| Runes(BTC NATIVE ERC20s) Minter | `https://runes.midl.xyz` |
| Faucet | [https://faucet.midl.xyz](https://faucet.midl.xyz) |

## Chain Details

| Property | Value |
|----------|-------|
| Chain ID | `0x3a99` (15001) |
| Network | `regtest` |
| Native Currency | BTC (18 decimals) |

## MIDL Config (React / wagmi)

The `MaestroSymphonyProvider` is used by default and resolves the Runes API URL automatically for the `regtest` network. You only need to set it explicitly if you want to override the default:

```ts
import { createConfig, regtest } from "@midl/core";
import { MaestroSymphonyProvider } from "@midl/core";
import { xverseConnector } from "@midl/connectors";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  // The Runes API URL is resolved automatically for regtest.
  // Override only if needed:
  runesProvider: new MaestroSymphonyProvider({
    regtest: "https://runes.staging.midl.xyz",
  }),
  persist: true,
});
```

For the wagmi config, use the `midlRegtest` chain object from `@midl/executor`:

```ts
import { midlRegtest } from "@midl/executor";
import { createConfig, http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [midlRegtest],
  transports: {
    [midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
  },
});
```

## Hardhat Config

```ts
import "hardhat-deploy";
import "@midl/hardhat-deploy";
import { MaestroSymphonyProvider, MempoolSpaceProvider } from "@midl/core";
import { midlRegtest } from "@midl/executor";
import { type HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";

export default (<HardhatUserConfig>{
  solidity: "0.8.28",
  defaultNetwork: "regtest",
  midl: {
    path: "deployments",
    networks: {
      regtest: {
        mnemonic: vars.get("MNEMONIC"),
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
        hardhatNetwork: "regtest",
        network: {
          explorerUrl: "https://mempool.staging.midl.xyz",
          id: "regtest",
          network: "regtest",
        },
        runesProviderFactory: () =>
          new MaestroSymphonyProvider({
            regtest: "https://runes.staging.midl.xyz",
          }),
        providerFactory: () =>
          new MempoolSpaceProvider({
            regtest: "https://mempool.staging.midl.xyz",
          }),
      },
    },
  },
  networks: {
    regtest: {
      url: midlRegtest.rpcUrls.default.http[0],
      chainId: midlRegtest.id,
    },
  },
  etherscan: {
    apiKey: {
      regtest: "empty",
    },
    customChains: [
      {
        network: "regtest",
        chainId: midlRegtest.id,
        urls: {
          apiURL: "https://blockscout.staging.midl.xyz/api",
          browserURL: "https://blockscout.staging.midl.xyz",
        },
      },
    ],
  },
});
```

::: tip
These are the **staging/regtest** endpoints for development. Mainnet endpoints will differ.
:::
