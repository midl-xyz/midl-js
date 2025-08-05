# useAddCompleteTxIntention

Adds a complete transaction intention. Wraps `addCompleteTxIntention` and stores the resulting intention in the context store.

## Import

```ts
import { useAddCompleteTxIntention } from "@midl-xyz/midl-js-executor-react";
```

## Example

```ts
const { addCompleteTxIntention } = useAddCompleteTxIntention();
addCompleteTxIntention({ assetsToWithdraw: [address1, address2] });
```

## Parameters

| Name     | Type               | Description                                              |
| -------- | ------------------ | -------------------------------------------------------- |
| `config` | `Config`           | (optional) Custom configuration to override the default. |
| `store`  | `MidlContextStore` | (optional) Custom store to override the default.         |



## Returns

| Name                          | Type                                                                            | Description                                                |
| ----------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `addCompleteTxIntention`      | `(variables: AddCompleteTxIntentionVariables) => void`                          | Mutation function to add a complete transaction intention. |
| `addCompleteTxIntentionAsync` | `(variables: AddCompleteTxIntentionVariables) => Promise<TransactionIntention>` | Async mutation function.                                   |
| `...rest`                     | `object`                                                                        | Additional mutation state from React Query.                |

### AddCompleteTxIntentionVariables

| Name               | Type                              | Description                               |
| ------------------ | --------------------------------- | ----------------------------------------- |
| `assetsToWithdraw` | `[Address] \| [Address, Address]` | Asset addresses to withdraw (BTC, Runes). |

