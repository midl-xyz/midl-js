# addRuneERC20

> **addRuneERC20**(`config`, `client`, `runeId`, `options?`): `Promise<EdictRuneResponse>`

Adds an ERC20 Rune to the Midl network. The action performs two transfers to the multisig:

- the minting fee (calculated using current BTC fee rate), and
- the Rune itself (amount 1).

The function validates the Rune name length and that the Rune has sufficient confirmations before creating the transaction.

## Import

```ts
import { addRuneERC20 } from "@midl/executor";
```

## Example

```ts
import { addRuneERC20 } from "@midl/executor";

const result = await addRuneERC20(config, client, "RUNEWITHVALIDNAME", { publish: true });
// or with rune ID "blockHeight:txIndex"
// await addRuneERC20(config, client, "123456:0", { publish: true });

console.log(result.tx.id);
```

## Parameters

| Name      | Type                               | Description                                                           |
| --------- | ---------------------------------- | --------------------------------------------------------------------- |
| `config`  | `Config`                           | The Midl configuration object.                                        |
| `client`  | `Client` (viem)                    | EVM/JSON-RPC client used to query fees                                |
| `runeId`  | `string`                           | The rune name or ID to add. Rune name must be at least 12 characters. |
| `options` | `{ publish?: boolean }` (optional) | If `publish` is true the transaction will be broadcast.               |

## Behavior & Validation

- Validates the rune name length: the rune's `name` must be at least 12 characters long. If not, the function throws an error.
- Fetches the current block height and ensures the rune has at least 6 confirmations. Otherwise it throws an error.
- Computes the mint fee using the current BTC fee rate and `calculateTransactionsCost` with `hasRunesDeposit: true`.
- Calls `edictRune` with two transfers to the multisig address:
  1. BTC transfer for the mint fee.
  2. Rune transfer with `amount: 1n` and the provided `runeId`.


## Returns

`Promise<EdictRuneResponse>` — The transaction response (PSBT/hex and metadata) returned by `edictRune`.

