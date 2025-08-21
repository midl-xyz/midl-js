# getBTCFeeRate

> **getBTCFeeRate**(`config`, `client`): `Promise<bigint>`

Gets the BTC fee rate defined in the Executor contract.

## Import

```ts
import { getBTCFeeRate } from "@midl/executor";
```

## Example

```ts
const feeRate = await getBTCFeeRate(config, client);
```

## Parameters

| Name     | Type     | Description               |
| -------- | -------- | ------------------------- |
| `config` | `Config` | The configuration object. |
| `client` | `Client` | Viem's client instance.   |

## Returns

`Promise<bigint>` — The BTC fee rate.

