# calculateTransactionsCost

> **calculateTransactionsCost**(`totalGas`, `options`): `bigint`

Calculates the cost of a batch of transactions in satoshis, considering gas usage, fee rate, and transaction types.

The function uses internal constants and a script size map to determine the cost based on the transaction types. The formula includes gas price, script size, and asset-specific values, all converted to satoshis.

## Usage

```ts
import { calculateTransactionsCost } from '@midl/executor';

const cost = calculateTransactionsCost(1000000n, {
  feeRate: 2, // fee rate in satoshis per byte
  hasRunesDeposit: true,
  hasWithdraw: false,
  hasRunesWithdraw: false,
  assetsToWithdrawSize: 0,
});
```

## Parameters

| Name                         | Type      | Description                                      |
| ---------------------------- | --------- | ------------------------------------------------ |
| totalGas                     | `bigint`  | The total gas used by the transactions.          |
| options.feeRate              | `number`  | Fee rate in satoshis per byte.                   |
| options.hasRunesDeposit      | `boolean` | Whether the batch includes a runes deposit.      |
| options.hasWithdraw          | `boolean` | Whether the batch includes a Bitcoin withdrawal. |
| options.hasRunesWithdraw     | `boolean` | Whether the batch includes a runes withdrawal.   |
| options.assetsToWithdrawSize | `number`  | The number of assets to withdraw (default is 0). |

## Returns

`bigint` — The calculated cost of the transactions in satoshis.

