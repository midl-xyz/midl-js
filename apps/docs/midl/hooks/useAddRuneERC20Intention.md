# useAddRuneERC20Intention

Adds a Rune to the Midl network. Wraps [`addRuneERC20Intention`](../actions/addRuneERC20Intention.md) and exposes a React Query mutation for creating a transaction intention.

## Import

```ts
import { useAddRuneERC20Intention } from "@midl/executor-react";
```

## Example

```ts
const { addRuneERC20 } = useAddRuneERC20Intention();

addRuneERC20({ runeId: "840000:1", reset: true });
```

## Parameters

| Name       | Type               | Description                                                                                                                |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `config`   | `Config`           | (optional) Custom configuration to override the default.                                                                   |
| `store`    | `MidlContextStore` | (optional) Custom Midl store.                                                                                              |
| `mutation` | `object`           | (optional) React Query `UseMutationOptions` (minus `mutationFn`). You can pass callbacks like `onSuccess`, `onError`, etc. |

## Returns

| Name                | Type                                                                           | Description                                 |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- |
| `addRuneERC20`      | `(variables: AddRuneERC20IntentionVariables) => void`                          | Mutation function to add a Rune intention.  |
| `addRuneERC20Async` | `(variables: AddRuneERC20IntentionVariables) => Promise<TransactionIntention>` | Async mutation function.                    |
| `...rest`           | `object`                                                                       | Additional mutation state from React Query. |

### AddRuneERC20IntentionVariables

| Name     | Type                 | Description                                                     |
| -------- | -------------------- | --------------------------------------------------------------- |
| `runeId` | `string`             | The rune name or ID to add.                                     |
| `reset`  | `boolean` (optional) | If true the current intentions array is replaced instead of appended to. |
