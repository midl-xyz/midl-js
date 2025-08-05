# useAddTxIntention

Adds a transaction intention. Wraps `addTxIntention` and stores the resulting intention in the context store.

## Import

```ts
import { useAddTxIntention } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const { addTxIntention } = useAddTxIntention();
addTxIntention({ intention });
```

## Parameters

| Name     | Type               | Description                                              |
| -------- | ------------------ | -------------------------------------------------------- |
| `config` | `Config`           | (optional) Custom configuration to override the default. |
| `store`  | `MidlContextStore` | (optional) Custom store to override the default.         |

## Returns

| Name                  | Type                                                                    | Description                                       |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| `addTxIntention`      | `(variables: AddTxIntentionVariables) => void`                          | Mutation function to add a transaction intention. |
| `addTxIntentionAsync` | `(variables: AddTxIntentionVariables) => Promise<TransactionIntention>` | Async mutation function.                          |
| `txIntentions`        | `TransactionIntention[]`                                                | The current transaction intentions in the store.  |
| `...rest`             | `object`                                                                | Additional mutation state from React Query.       |

### AddTxIntentionVariables

| Name        | Type                 | Description                                                                 |
| ----------- | -------------------- | --------------------------------------------------------------------------- |
| `intention` | `PartialIntention`   | The intention to add.                                                       |
| `reset`     | `boolean` (optional) | If true, the array of intentions will be cleared before adding the new one. |
| `from`      | `string` (optional)  | BTC address of the account to use to sign the transaction.                  |

