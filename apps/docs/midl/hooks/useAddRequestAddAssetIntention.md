# useAddRequestAddAssetIntention

Adds a request to add an asset intention. Wraps `addRequestAddAssetIntention` and stores the resulting intention in the context store.

## Import

```ts
import { useAddRequestAddAssetIntention } from "@midl/executor-react";
```

## Example

```ts
const { addRequestAddAssetIntention } = useAddRequestAddAssetIntention();
addRequestAddAssetIntention({
  address: "0x0000000000000000000000000000000000000000",
  runeId: "840000:1",
  amount: 1000000n,
});
```

## Parameters

| Name     | Type               | Description                                              |
| -------- | ------------------ | -------------------------------------------------------- |
| `config` | `Config`           | (optional) Custom configuration to override the default. |
| `store`  | `MidlContextStore` | (optional) Custom store to override the default.         |

## Returns

| Name                               | Type                                                                                | Description                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `addRequestAddAssetIntention`      | `(variables: AddRequestAddAssetIntentionVariables) => void`                          | Mutation function to add the intention.                      |
| `addRequestAddAssetIntentionAsync` | `(variables: AddRequestAddAssetIntentionVariables) => Promise<TransactionIntention>` | Async mutation function.                                     |
| `...rest`                          | `object`                                                                            | Additional mutation state from React Query.                  |

### AddRequestAddAssetIntentionVariables

| Name      | Type                | Description                                                     |
| --------- | ------------------- | --------------------------------------------------------------- |
| `address` | `0x${string}`        | ERC20 contract address.                                         |
| `runeId`  | `string`             | The rune ID to associate with the asset.                        |
| `amount`  | `bigint`             | Amount of the rune to deposit.                                  |
| `from`    | `string` (optional)  | BTC address to use for the intention.                           |
| `reset`   | `boolean` (optional) | If true, clears existing intentions before adding the new one.  |
