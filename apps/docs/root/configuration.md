---
order: 3
---

# Configuration

MIDL.js shares a common configuration object across all actions and hooks. This configuration object is used to specify the network, connectors, and other settings.

## Creating a Configuration Object

To create a configuration object, use the `createConfig` function:

```ts
import {
  createConfig,
  regtest,
  LeatherConnector,
} from "@midl-xyz/midl-js-core";

export const config = createConfig({
  networks: [regtest],
  connectors: [new LeatherConnector()],
  persist: true,
});
```

## Configuration Options

| Name       | Type                  | Description                                       |
| ---------- | --------------------- | ------------------------------------------------- |
| networks   | `BitcoinNetwork[]`    | The bitcoin networks to use                       |
| connectors | `CreateConnectorFn[]` | The connectors to use                             |
| persist    | `boolean` (optional)  | If true, the config will persist in local storage |

### Available Networks

MIDL.js supports the following networks:

- `mainnet`
- `signet`
- `testnet`
- `regtest`
- `testnet4`

#### Importing Networks

```ts
import { mainnet, testnet, regtest, testnet4, signet } from "@midl-xyz/midl-js-core";
```

### Supported Connectors (Wallets)

MIDL.js supports the following connectors:

- [`Leather`](https://leather.io)
- [`XVerse`](https://xverse.app)
- [`Unisat`](https://unisat.io)
- `keyPair` - ECPair key pair connector

You can also create your own custom connector by implementing the `CreateConnectorFn` interface.

#### Importing Connectors

```ts
import { leather, satsConnect, unisat, keyPair } from "@midl-xyz/midl-js-core";
```
