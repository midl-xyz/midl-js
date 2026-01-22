# keyPairConnector

Creates a connector backed by a mnemonic or raw private keys. Useful for Node.js scripts, tests, or automation.

## Import

```ts
import { keyPairConnector } from "@midl/node";
```

## Usage

```ts
import { createConfig, regtest, AddressPurpose } from "@midl/core";
import { keyPairConnector } from "@midl/node";

const config = createConfig({
  networks: [regtest],
  connectors: [
    keyPairConnector({
      mnemonic: "test test test test test test test test test test test junk",
    }),
  ],
});
```

## Parameters

The connector accepts either a `mnemonic` **or** a `privateKeys` array.

| Name | Type | Description |
| --- | --- | --- |
| `mnemonic` | `string` | BIP39 mnemonic phrase. |
| `privateKeys` | `string[]` | Array of private keys (WIF or hex). |
| `paymentAddressType` | `AddressType` (optional) | Address type for payment account. Default: `P2WPKH`. |
| `accountIndex` | `number` (optional) | Account index to derive. Default: `0`. |
| `metadata` | `UserMetadata` (optional) | Optional connector metadata override. |

## Notes

- Only one of `mnemonic` or `privateKeys` may be provided.
- If `privateKeys` are supplied, `accountIndex` selects the key at that index.
