---
title: Connectors
order: 4
---

# Connectors

`@midl/connectors` provides prebuilt wallet connectors you can plug into `createConfig`.

## Import

```ts
import {
  xverseConnector,
  leatherConnector,
  unisatConnector,
  phantomConnector,
  bitgetConnector,
  okxConnector,
  magicEdenConnector,
} from "@midl/connectors";
```

## Usage

```ts
import { createConfig, regtest } from "@midl/core";
import { xverseConnector, leatherConnector } from "@midl/connectors";

export const config = createConfig({
  networks: [regtest],
  connectors: [xverseConnector(), leatherConnector()],
  persist: true,
});
```

## Available Connectors

| Connector Function | Wallet |
| --- | --- |
| `xverseConnector()` | Xverse |
| `leatherConnector()` | Leather |
| `unisatConnector()` | Unisat |
| `phantomConnector()` | Phantom |
| `bitgetConnector()` | Bitget |
| `okxConnector()` | OKX Wallet |
| `magicEdenConnector()` | Magic Eden |

## Custom Metadata

Each connector accepts an optional `metadata` object to customize how it appears in wallet lists.

```ts
const connector = xverseConnector({
  metadata: {
    name: "Xverse",
    description: "Preferred wallet",
  },
});
```
