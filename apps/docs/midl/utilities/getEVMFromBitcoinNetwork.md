# getEVMFromBitcoinNetwork

Returns the EVM chain configuration for a given Bitcoin network.

## Import

```ts
import { getEVMFromBitcoinNetwork } from "@midl/executor";
```

## Example

```ts
import { regtest } from "@midl/core";

const evmChain = getEVMFromBitcoinNetwork(regtest);
```

## Parameters

| Name      | Type              | Description        |
| --------- | ----------------- | ------------------ |
| `network` | `BitcoinNetwork`  | Bitcoin network.   |

## Returns

`Chain` — The EVM chain configuration.

## Errors

Throws if the network is not supported.
