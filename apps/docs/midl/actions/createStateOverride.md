# createStateOverride

> **createStateOverride**(`config`, `client`, `intentions`, `fees?`): `Promise<StateOverride>`

Creates a state override for EVM simulation based on the provided transaction intentions. Aggregates BTC and rune balances and prepares a state override array for use in EVM simulation or testing.

## Import

```ts
import { createStateOverride } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
import { createStateOverride } from "@midl-xyz/midl-js-executor";

const overrides = await createStateOverride(config, client, intentions);
// Use overrides in EVM simulation or testing
```

## Parameters

| Name         | Type                     | Description                                                 |
| ------------ | ------------------------ | ----------------------------------------------------------- |
| `config`     | `Config`                 | The current config object.                                  |
| `client`     | `Client`                 | Viem's client instance.                                     |
| `intentions` | `TransactionIntention[]` | Array of transaction intentions to aggregate balances from. |
| `fees`       | `bigint` (optional)      | BTC fees in wei (default: 1 BTC, converted to ETH units).   |

## Returns

`Promise<StateOverride>` — The state override array for EVM simulation.

