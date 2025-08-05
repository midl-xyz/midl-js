# connect

> **connect**(`config`, `params`, `connectorId?`): `Promise<Account[]>`

Connects to a wallet connector and retrieves user accounts for the specified purposes and network.

## Import

```ts
import { connect } from "@midl-xyz/midl-js-core";
```

## Example

```ts
import { connect } from "@midl-xyz/midl-js-core";
import { AddressPurpose } from "@midl-xyz/midl-js-core";

const accounts = await connect(config, { purposes: [AddressPurpose.Payment] });
console.log(accounts);
```

## Parameters

| Name         | Type                                                            | Description                                                                 |
| ------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| config       | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object                                                    |
| params       | [`ConnectParams`](#connectparams)                               | Connection parameters                                                       |
| connectorId? | `string`                                                        | (Optional) The ID of the connector to use. Defaults to the first connector. |

### ConnectParams

| Name     | Type               | Description                                  |
| -------- | ------------------ | -------------------------------------------- |
| purposes | `AddressPurpose[]` | Array of address purposes to request         |
| network? | `BitcoinNetwork`   | (Optional) The Bitcoin network to connect to |

## Returns

`Promise<Account[]>` – Resolves to the list of connected accounts.

## Errors

Throws `EmptyAccountsError` if the connector returns no accounts.
