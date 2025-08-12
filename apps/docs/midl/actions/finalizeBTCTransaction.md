# finalizeBTCTransaction

> **finalizeBTCTransaction**(`config`, `intentions`, `client`, `options?`): `Promise<EdictRuneResponse | TransferBTCResponse>`

Prepares a Bitcoin transaction for the provided intentions. Calculates gas limits for EVM transactions, total fees, and handles both BTC and rune transfers.


## Import

```ts
import { finalizeBTCTransaction } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
import { finalizeBTCTransaction } from "@midl-xyz/midl-js-executor";

const btcTx = await finalizeBTCTransaction(config, intentions, client, { feeRate: 10 });
```

## Parameters

| Name         | Type                                                                         | Description                                 |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------------------- |
| `config`     | `Config`                                                                     | The configuration object.                   |
| `intentions` | `TransactionIntention[]                                                      | Array of transaction intentions to process. |
| `client`     | `Client`                                                                     | Viem's client instance.                     |
| `options`    | [`FinalizeBTCTransactionOptions`](#finalizebtctransactionoptions) (optional) | Optional configuration options.             |

### FinalizeBTCTransactionOptions

| Name                   | Type                       | Description                                         |
| ---------------------- | -------------------------- | --------------------------------------------------- |
| `stateOverride`        | `StateOverride` (optional) | State override for EVM transactions.                |
| `from`                 | `string` (optional)        | BTC address of the account to use for signing.      |
| `feeRate`              | `number` (optional)        | Custom fee rate (sats/vB).                          |
| `assetsToWithdrawSize` | `number` (optional)        | Number of assets to withdraw.                       |
| `skipEstimateGasMulti` | `boolean` (optional)       | If true, skips gas estimation for EVM transactions. |
| `multisigAddress`      | `string` (optional)        | Multisig address to use for the transaction.        |

## Returns

`Promise<EdictRuneResponse | TransferBTCResponse>` — The BTC transaction response.

