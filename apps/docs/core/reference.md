---
order: 6
---

# Reference

## Account

| Name        | Type                                     | Description                   |
| ----------- | ---------------------------------------- | ----------------------------- |
| address     | `string`                                 | The address of the account    |
| addressType | [`AddressType`](#addresstype-enum)       | The type of the address       |
| publicKey   | `string`                                 | The public key of the account |
| purpose     | [`AddressPurpose`](#addresspurpose-enum) | The purpose of the address    |

### AddressType (enum)

| Name          | Value         |
| ------------- | ------------- |
| `P2SH_P2WPKH` | "p2sh_p2wpkh" |
| `P2WPKH`      | "p2wpkh"      |
| `P2TR`        | "p2tr"        |

### AddressPurpose (enum)

| Name       | Value      |
| ---------- | ---------- |
| `Ordinals` | "Ordinals" |
| `Payment`  | "Payment"  |

## Config

| Name           | Type                                                                     | Description                          |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| networks       | `BitcoinNetwork[]`                                                       | The available Bitcoin networks       |
| connectors     | `ConnectorWithMetadata[]`                                                | The available connectors             |
| connection     | `Connector \| undefined`                                                 | The active connection (if any)       |
| accounts       | `Account[] \| undefined`                                                 | The connected accounts (if any)      |
| network        | `BitcoinNetwork`                                                         | The current Bitcoin network          |
| provider       | `AbstractProvider`                                                       | The BTC data provider                |
| runesProvider  | `AbstractRunesProvider`                                                  | The runes data provider              |
| defaultPurpose | `AddressPurpose \| undefined`                                            | Default purpose for account selection|
| setState       | `(state: Partial<ConfigState>) => void`                                  | Sets the configuration state         |
| getState       | `() => ConfigState`                                                      | Gets the current configuration state |
| subscribe      | `(callback: (newState: ConfigState \| undefined) => void) => () => void` | Subscribes to configuration changes  |

## NetworkConfig

| Name       | Type                 | Description                          |
| ---------- | -------------------- | ------------------------------------ |
| name       | string               | The display name of the network      |
| network    | BitcoinNetwork["id"] | The network ID (from BitcoinNetwork) |
| rpcUrl     | string               | The RPC URL for the network          |
| indexerUrl | string               | The indexer URL for the network      |
