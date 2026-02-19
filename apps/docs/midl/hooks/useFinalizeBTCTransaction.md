# useFinalizeBTCTransaction

Prepares a Bitcoin transaction for the provided intentions. Calculates gas limits for EVM transactions, total fees, and transfers. Handles both BTC and rune transfers.

## Import

```ts
import { useFinalizeBTCTransaction } from "@midl/executor-react";
```

## Example

```ts
const { finalizeBTCTransaction } = useFinalizeBTCTransaction();
finalizeBTCTransaction({ feeRate: 10 });
```

## Parameters

| Name       | Type                            | Description                                   |
| ---------- | ------------------------------- | --------------------------------------------- |
| `mutation` | `UseMutationOptions` (optional) | Mutation options for React Query.             |
| `config`   | `Config` (optional)             | Custom configuration to override the default. |
| `store`    | `MidlContextStore` (optional)   | Custom store to override the default.         |


## Returns

| Name                          | Type                                                                                          | Description                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `finalizeBTCTransaction`      | `(variables: FinalizeMutationVariables) => void`                                              | Function to initiate finalizing BTC transactions. |
| `finalizeBTCTransactionAsync` | `(variables: FinalizeMutationVariables) => Promise<EdictRuneResponse \| TransferBTCResponse>` | Async function to finalize BTC transactions.      |
| `...rest`                     | object                                                                                        | Additional mutation state from React Query.       |

### FinalizeMutationVariables

| Name              | Type                       | Description                                             |
| ----------------- | -------------------------- | ------------------------------------------------------- |
| `stateOverride`   | `StateOverride` (optional)              | State override to estimate the cost of the transaction.                                                              |
| `feeRate`         | `number` (optional)                     | Custom fee rate in sats/vB.                                                                                          |
| `skipEstimateGas` | `boolean` (optional)                    | If true, skip the gas estimation for EVM transactions.                                                               |
| `from`            | `string` (optional)                     | BTC address used to sign the transactions.                                                                           |
| `multisigAddress` | `string` (optional)                     | Multisig address to use for the transaction. If not provided, the default multisig address for the network is used.  |
| `gasMultiplier`   | `number` (optional)                     | Gas multiplier to apply to the estimated gas limit (default: 1.2).                                                   |
| `transfers`       | `EdictRuneParams["transfers"]` (optional) | Optional transfers to include in the transaction for additional rune or BTC transfers not derived from the intentions. |
