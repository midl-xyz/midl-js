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
| Option                     | Type                                    | Description                                          |
| -------------------------- | --------------------------------------- | ---------------------------------------------------- |
| `mnemonic`                 | `string`                                | Mnemonic phrase for wallet                           |
| `privateKeys`              | `string[]`                              | Array of private keys (WIF or hex)                   |
| `connectorFactory`         | `function`                              | Custom connector factory                             |
| `paymentAddressType`       | `AddressType` (optional)                | Address type for payment account                     |
| `confirmationsRequired`    | `number` (optional)                     | EVM confirmations required                           |
| `btcConfirmationsRequired` | `number` (optional)                     | BTC confirmations required                           |
| `network`                  | `string` \| `BitcoinNetwork` (optional) | Bitcoin network or name                              |
| `hardhatNetwork`           | `string` (optional)                     | Name of the Hardhat network to use                   |
| `providerFactory`          | `() => AbstractProvider` (optional)     | Custom BTC data provider factory                     |
| `runesProviderFactory`     | `() => AbstractRunesProvider` (optional)| Custom runes data provider factory                   |
| `defaultPurpose`           | `AddressPurpose` (optional)             | Default purpose for wallet                           |

> [!NOTE]
> Provide exactly one of `mnemonic`, `privateKeys`, or `connectorFactory`.

## Example

```ts
import { AddressPurpose } from "@midl/core";

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
        defaultPurpose: AddressPurpose.Payment
      },
    },
  },
};
```

See the [API Reference](./api.md) for more details on usage.
