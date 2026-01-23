# getBTCFeeRate

> **getBTCFeeRate**(`client`): `Promise<bigint>`

Gets the BTC fee rate defined in the Executor contract.

## Import

```ts
import { getBTCFeeRate } from "@midl/executor";
```

## Example

```ts
const feeRate = await getBTCFeeRate(client);
```

## Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `client` | `Client` | Viem's client instance. |

## Returns

`Promise<bigint>` — The BTC fee rate.
