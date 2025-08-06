---
order: 1
---

# Configuration

The `midl` field in your Hardhat config enables integration with the MIDL Hardhat plugin. Below is the configuration reference:

## Options

| Option     | Type                            | Description                        |
| ---------- | ------------------------------- | ---------------------------------- |
| `path`     | `string` (optional)             | Path to deployments directory      |
| `networks` | `Record<string, NetworkConfig>` | Network configurations (see below) |

### NetworkConfig
| Option                     | Type                                         | Description                        |
| -------------------------- | -------------------------------------------- | ---------------------------------- |
| `mnemonic`                 | `string`                                     | Mnemonic phrase for wallet         |
| `confirmationsRequired`    | `number` (optional)                          | EVM confirmations required         |
| `btcConfirmationsRequired` | `number` (optional)                          | BTC confirmations required         |
| `network`                  | `string` \| `BitcoinNetwork` (optional)      | Bitcoin network or name            |
| `hardhatNetwork`           | `string` (optional)                          | Name of the Hardhat network to use |
| `provider`                 | `AbstractProvider` (optional)                | Custom BTC data provider           |
| `derivationPath`           | `"xverse" \| "leather" \| string` (optional) | Wallet derivation path             |
| `defaultPurpose`           | `AddressPurpose` (optional)                  | Default purpose for wallet         |

## Example

```ts
import { AddressPurpose } from "@midl-xyz/midl-js-core";

export default {
  midl: {
    path: "deployments",
    networks: {
      default: {
        mnemonic: "test test test ...",
        confirmationsRequired: 5,
        btcConfirmationsRequired: 1,
        network: "regtest",
        hardhatNetwork: "regtest",
        derivationPath: "xverse",
        defaultPurpose: AddressPurpose.Payment
      },
    },
  },
};
```

See the [API Reference](./api.md) for more details on usage.