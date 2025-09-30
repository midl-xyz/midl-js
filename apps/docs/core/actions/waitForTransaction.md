# waitForTransaction

> **waitForTransaction**(`config`, `txId`, `confirmations`, `params`): `Promise`\<`number`\>

Waits for a transaction to be confirmed with the given parameters.

## Import

```ts
import { waitForTransaction } from "@midl/core";
```

## Example

```ts
const confirmations = await waitForTransaction(config, "txid", 1);
console.log(confirmations);
```

## Parameters

| Name          | Type                                                            | Description                             |
| ------------- | --------------------------------------------------------------- | --------------------------------------- |
| config        | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object                |
| txId          | `string`                                                        | The transaction ID                      |
| confirmations | `number`                                                        | The number of confirmations to wait for |
| params        | [`WaitForTransactionParams`](#waitfortransactionparams)         | The parameters for the request          |

### WaitForTransactionParams

| Name        | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| maxAttempts | `number` | The maximum number of attempts |
| intervalMs  | `number` | The interval in milliseconds   |

## Returns

`Promise`\<`number`\> - The number of confirmations
