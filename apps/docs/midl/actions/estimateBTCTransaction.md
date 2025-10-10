# estimateBTCTransaction

> **estimateBTCTransaction**(`config`, `intentions`, `client`, `options?`): `Promise<EstimateBTCTransactionResponse>`

Estimates the cost and gas requirements for a Bitcoin transaction with the provided intentions. Calculates gas limits for EVM transactions and total fees without executing the transaction.

## Import

```ts
import { estimateBTCTransaction } from "@midl/executor";
```

## Example

```ts
import { estimateBTCTransaction } from "@midl/executor";

const {fee, intentions} = await estimateBTCTransaction(config, intentions, client, { feeRate: 10 });
console.log(`Estimated fee: ${fee} satoshis`);
console.log(`Updated intentions:`, intentions);
```

## Parameters

| Name         | Type                                                                         | Description                                  |
| ------------ | ---------------------------------------------------------------------------- | -------------------------------------------- |
| `config`     | `Config`                                                                     | The configuration object.                    |
| `intentions` | `TransactionIntention[]`                                                     | Array of transaction intentions to estimate. |
| `client`     | `Client`                                                                     | Viem's client instance.                      |
| `options`    | [`EstimateBTCTransactionOptions`](#estimatebtctransactionoptions) (optional) | Optional configuration options.              |

### EstimateBTCTransactionOptions

| Name              | Type                       | Description                                                                          |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `stateOverride`   | `StateOverride` (optional) | State override for EVM transactions.                                                 |
| `from`            | `string` (optional)        | BTC address of the account to use for signing.                                       |
| `feeRate`         | `number` (optional)        | Custom fee rate (sats/vB).                                                           |
| `multisigAddress` | `string` (optional)        | Multisig address to use for the transaction.                                         |
| `gasMultiplier`   | `number` (optional)        | Multiplier to apply to estimated gas (default: 1.2). Used to avoid gas fluctuations. |

## Returns

`Promise<EstimateBTCTransactionResponse>` — The estimation response containing fee and updated intentions.

### EstimateBTCTransactionResponse

| Name         | Type                     | Description                                                         |
| ------------ | ------------------------ | ------------------------------------------------------------------- |
| `fee`        | `bigint`                 | The estimated total cost in satoshis.                               |
| `intentions` | `TransactionIntention[]` | The cloned intentions with updated gas limits for EVM transactions. |