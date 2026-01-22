# useEstimateBTCTransaction

Estimates the cost and gas requirements for a Bitcoin transaction with the provided intentions. Calculates gas limits for EVM transactions and total fees without executing the transaction.

## Import

```ts
import { useEstimateBTCTransaction } from "@midl/executor-react";
```

## Example

```ts
const { data: estimation, isLoading, error } = useEstimateBTCTransaction(intentions, {
  feeRate: 10,
  gasMultiplier: 1.5
});

console.log(`Estimated fee: ${estimation?.fee} satoshis`);
console.log(`Updated intentions:`, estimation?.intentions);
```

## Parameters

| Name         | Type                                                                             | Description                                  |
| ------------ | -------------------------------------------------------------------------------- | -------------------------------------------- |
| `intentions` | `TransactionIntention[]`                                                         | Array of transaction intentions to estimate. |
| `options`    | [`UseEstimateBTCTransactionParams`](#useestimatebtctransactionparams) (optional) | Optional configuration and query options.    |

### UseEstimateBTCTransactionParams

Extends [`EstimateBTCTransactionOptions`](../actions/estimateBTCTransaction.md#estimatebtctransactionoptions) with additional query options:

| Name              | Type                         | Description                                                                          |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| `stateOverride`   | `StateOverride` (optional)   | State override for EVM transactions.                                                 |
| `from`            | `string` (optional)          | BTC address of the account to use for signing.                                       |
| `feeRate`         | `number` (optional)          | Custom fee rate (sats/vB).                                                           |
| `multisigAddress` | `string` (optional)          | Multisig address to use for the transaction.                                         |
| `gasMultiplier`   | `number` (optional)          | Multiplier to apply to estimated gas (default: 1.2). Used to avoid gas fluctuations. |
| `skipEstimateGas` | `boolean` (optional)         | If true, skips gas estimation for EVM transactions.                                  |
| `query`           | `UseQueryOptions` (optional) | Query options for React Query.                                                       |
| `config`          | `Config` (optional)          | Custom configuration to override the default.                                        |

## Returns

Returns a React Query result object with the following properties:

| Name        | Type                                                                                                                   | Description                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `data`      | [`EstimateBTCTransactionResponse`](../actions/estimateBTCTransaction.md#estimatebtctransactionresponse) \| `undefined` | The estimation response containing fee and updated intentions. |
| `isLoading` | `boolean`                                                                                                              | Whether the query is currently loading.                        |
| `isError`   | `boolean`                                                                                                              | Whether the query has an error.                                |
| `error`     | `Error` \| `null`                                                                                                      | The error object if the query failed.                          |
| `isSuccess` | `boolean`                                                                                                              | Whether the query completed successfully.                      |
| `refetch`   | `() => void`                                                                                                           | Function to manually refetch the estimation.                   |
| `...rest`   | object                                                                                                                 | Additional query state from React Query.                       |

### EstimateBTCTransactionResponse

| Name         | Type                     | Description                                                         |
| ------------ | ------------------------ | ------------------------------------------------------------------- |
| `fee`        | `number`                 | The estimated total cost in satoshis.                               |
| `intentions` | `TransactionIntention[]` | The cloned intentions with updated gas limits for EVM transactions. |

## Query Behavior

- The query is **enabled by default** when:
  - A network is set in the configuration
  - The `intentions` array is not empty
- The query is **disabled** when:
  - No network is configured
  - The `intentions` array is empty
  - Explicitly disabled via `query.enabled: false`
- The query will automatically refetch when the `intentions` parameter changes
