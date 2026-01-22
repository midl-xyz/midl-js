# addRuneERC20Intention

> **addRuneERC20Intention**(`config`, `runeId`): `Promise<TransactionIntention>`

Creates a transaction intention to add a Rune via the ERC20 interface. It validates the Rune confirmations, then prepares an intention that deposits the Rune (amount 1).

## Import

```ts
import { addRuneERC20Intention } from "@midl/executor";
```

## Example

```ts
import { addRuneERC20Intention } from "@midl/executor";

const intention = await addRuneERC20Intention(config, "840000:1");

console.log(intention);
```

## Parameters

| Name     | Type     | Description                         |
| -------- | -------- | ----------------------------------- |
| `config` | `Config` | The Midl configuration object.      |
| `runeId` | `string` | The rune name or ID to add.         |

## Behavior & Validation

- Ensures the rune has at least 6 confirmations based on current block height.
- Creates a transaction intention via `addTxIntention` with a Rune deposit:
  - `runes: [{ id: runeId, amount: 1n }]`

## Returns

`Promise<TransactionIntention>` — The created transaction intention.
