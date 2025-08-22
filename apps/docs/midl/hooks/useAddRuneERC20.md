# useAddRuneERC20

Adds an ERC20 Rune to the Midl network. Wraps [`addRuneERC20`](../actions/addRuneERC20.md) and exposes a React Query mutation for creating the transaction.

## Import

```ts
import { useAddRuneERC20 } from "@midl/executor-react";
```

## Example

```ts
const { addRuneERC20 } = useAddRuneERC20();
addRuneERC20({ runeId: "RUNE1234567890", publish: true });
```

## Parameters

| Name       | Type     | Description                                                                                                                |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `config`   | `Config` | (optional) Custom configuration to override the default.                                                                   |
| `mutation` | `object` | (optional) React Query `UseMutationOptions` (minus `mutationFn`). You can pass callbacks like `onSuccess`, `onError`, etc. |

## Returns

| Name                | Type                                                               | Description                                          |
| ------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| `addRuneERC20`      | `(variables: AddRuneERC20Variables) => void`                       | Mutation function to add a Rune via ERC20 interface. |
| `addRuneERC20Async` | `(variables: AddRuneERC20Variables) => Promise<EdictRuneResponse>` | Async mutation function.                             |
| `...rest`           | `object`                                                           | Additional mutation state from React Query.          |

### AddRuneERC20Variables

| Name      | Type                 | Description                                                                                            |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `runeId`  | `string`             | The rune name or ID to add. Must match the same rules as `addRuneERC20` (name length & confirmations). |
| `publish` | `boolean` (optional) | If true the transaction will be broadcast immediately.                                                 |

