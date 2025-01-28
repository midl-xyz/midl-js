# etchRune

> **etchRune**(`config`, `params`): `Promise`\<\{ `etchingTx`: `string`; `fundingTx`: `string`; `revealTx`: `string`; \}\>

Etches (mints) a rune on Bitcoin. The rune will be etched and revealed in the consecutive transactions.
This function creates the etching, funding, and reveal transactions.
The transactions won't be broadcasted. Once the transactions are created, you can broadcast them using the [broadcastTransaction](broadcastTransaction.md) function in
the following order: funding, etching, reveal.

## Import

```ts
import { etchRune } from "@midl-xyz/midl-js-core";
```

## Example

```ts
import { etchRune } from "@midl-xyz/midl-js-core";
import { broadcastTransaction } from "@midl-xyz/midl-js-core";

const etching = await etchRune(config, {
    name: "RUNE•NAME",
    receiver: "bc1q...",
    amount: 100,
 ...
});

const fundingTxHash = await broadcastTransaction(config, etching.fundingTx);
const etchingTxHash = await broadcastTransaction(config, etching.etchingTx);
const revealTxHash = await broadcastTransaction(config, etching.revealTx);

console.log(fundingTxHash, etchingTxHash, revealTxHash);
```

## Parameters

| Name   | Type                                                         | Description              |
| ------ | ------------------------------------------------------------ | ------------------------ |
| config | [`Config`](../configuration/index#creating-a-configuration-object) | The configuration object |
| params | [`EtchRuneParams`](#etchruneparams)                          | The etch rune parameters |

### EtchRuneParams

| Name          | Type     | Description                                                                                        |
| ------------- | -------- | -------------------------------------------------------------------------------------------------- |
| name          | `string` | The name of the rune to etch. Should be uppercase and spaced with • (U+2022). Example: "RUNE•NAME" |
| amount?       | `number` | The amount minted per each mint.                                                                   |
| cap?          | `number` | The maximum number of mints allowed.                                                               |
| content?      | `string` | The content to inscribe on the rune.                                                               |
| divisibility? | `number` | The divisibility of the rune.                                                                      |
| feeRate?      | `number` | The fee rate to use for the etching transaction.                                                   |
| from?         | `string` | The address to etch the rune from.                                                                 |
| heightEnd?    | `number` | The height at which the minting ends.                                                              |
| heightStart?  | `number` | The height at which the minting starts.                                                            |
| offsetEnd?    | `number` | The offset after etching when minting ends.                                                        |
| offsetStart?  | `number` | The offset after etching when minting starts.                                                      |
| premine?      | `number` | The amount of premined runes to include in the etching.                                            |
| receiver?     | `string` | The address to mint the rune to.                                                                   |
| symbol?       | `string` | The symbol of the rune to etch. One character only.                                                |

## Returns

`Promise`\<\{ `etchingTx`: `string`; `fundingTx`: `string`; `revealTx`: `string`; \}\>

The etching, funding, and reveal transactions hex transactions.

| Name      | Type     | Description                 |
| --------- | -------- | --------------------------- |
| etchingTx | `string` | The etching transaction hex |
| fundingTx | `string` | The funding transaction hex |
| revealTx  | `string` | The reveal transaction hex  |
