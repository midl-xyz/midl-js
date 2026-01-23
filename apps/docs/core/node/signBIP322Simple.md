# signBIP322Simple

Signs a message using the BIP322 simple signing scheme.

## Import

```ts
import { signBIP322Simple } from "@midl/node";
import { networks } from "bitcoinjs-lib";
```

## Example

```ts
const signature = signBIP322Simple(
  "Hello, world!",
  "L2V5...wif",
  "bcrt1q...",
  networks.regtest,
);
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `message` | `string` | Message to sign. |
| `privateKey` | `string` | Private key in WIF format. |
| `address` | `string` | Address that corresponds to the key. |
| `network` | `Network` | bitcoinjs-lib network instance. |

## Returns

`string` — Base64-encoded BIP322 signature.
