# addCompleteTxIntention

> **addCompleteTxIntention**(`config`, `assetsToWithdraw?`): `Promise<TransactionIntention>`

Create a CompleteTx Intention. This prepares an EVM transaction that calls the `completeTx` function on the executor contract. 

## Import

```ts
import { addCompleteTxIntention } from "@midl-xyz/midl-js";
```

## Example

```ts
import { addCompleteTxIntention } from "@midl-xyz/midl-js";

const intention = await addCompleteTxIntention(config, [btcAddress, runeAddress]);
```

## Parameters

| Name               | Type                                                         | Description                                                                                  |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `config`           | [`Config`](../reference/Config.md)                           | The configuration object.                                                                    |
| `assetsToWithdraw` | [`[Address] \| [Address, Address]`](../reference/Address.md) | ERC20 addresses corresponding to Runes to withdraw. If omitted, no assets will be withdrawn. |

## Returns

`Promise<TransactionIntention>` — The prepared transaction intention object.

## Notes
- The function automatically determines the correct receiver addresses for BTC and runes based on the current config accounts.
