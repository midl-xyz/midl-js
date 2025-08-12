# useSendBTCTransactions

Sends a batch of MIDL transactions. Expects `serializedTransactions` to be an array of signed serialized MIDL transactions and `btcTransaction` to be a signed Bitcoin transaction hex.

## Import

```ts
import { useSendBTCTransactions } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const { sendBTCTransactions } = useSendBTCTransactions();
sendBTCTransactions({ serializedTransactions, btcTransaction });
```

## Parameters

| Name       | Type              | Description                       |
| ---------- | ----------------- | --------------------------------- |
| `mutation` | object (optional) | Mutation options for React Query. |



## Returns

| Name                       | Type                                                                                  | Description                                 |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| `sendBTCTransactions`      | `(variables: SendBTCTransactionsParameter) => void`                                   | Mutation function to send BTC transactions. |
| `sendBTCTransactionsAsync` | `(variables: SendBTCTransactionsParameter) => Promise<SendBTCTransactionsReturnType>` | Async mutation function.                    |
| `...rest`                  | object                                                                                | Additional mutation state from React Query. |

## SendBTCTransactionsParameter

| Name                     | Type   | Description                                   |
| ------------------------ | ------ | --------------------------------------------- |
| `serializedTransactions` | array  | Array of signed serialized MIDL transactions. |
| `btcTransaction`         | string | Signed Bitcoin transaction hex.               |