# finalizeBTCTransaction

> **finalizeBTCTransaction**(`config`, `store`, `client`, `options`): `Promise`\<[`EdictRuneResponse`](../../root/actions/edictRune.md#edictruneresponse) \| [`TransferBTCResponse`](../../root/actions/transferBTC.md#transferbtcresponse) \>

Prepares BTC transaction for the intentions.
Calculates gas limits for EVM transactions, total fees and transfers.

If `options.shouldComplete` is true, adds a complete transaction to the intentions.

## Import

```ts
import { finalizeBTCTransaction } from "@midl-xyz/midl-js-executor";
```

## Example

```ts
import { createPublicClient } from "viem";

const client = createPublicClient({
  chain, // midl chain
  transport, // http transport for midl chain
});

const tx = await finalizeBTCTransaction(config, store, client, {
  shouldComplete: true,
});
```

## Parameters

| Name    | Type                                                                    | Description                 |
| ------- | ----------------------------------------------------------------------- | --------------------------- |
| config  | [`Config`](../../root/configuration.md#creating-a-configuration-object) | The configuration object    |
| store   | `Store`                                                                 | The store object            |
| client  | `object`                                                                | EVM client or provider      |
| options | [`FinalizeBTCTransactionOptions`](#finalizebtctransactionoptions)       | The options for the request |

### FinalizeBTCTransactionOptions

| Name                  | Type                              | Description                                    |
| --------------------- | --------------------------------- | ---------------------------------------------- |
| stateOverride?        | `StateOverride`                   | State override for EVM transactions            |
| publicKey?            | `string`                          | Public key of the account to use for signing   |
| gasPrice?             | `bigint`                          | Gas price for EVM transactions                 |
| shouldComplete?       | `boolean`                         | If true, send complete transaction             |
| feeRateMultiplier?    | `number`                          | Fee rate multiplier for the transaction        |
| assetsToWithdraw?     | `[Address] \| [Address, Address]` | Array of ERC20 assets to withdraw              |
| skipEstimateGasMulti? | `boolean`                         | If true, skip estimating gas multi for EVM txs |

## Returns

`Promise`\<[`EdictRuneResponse`](../../root/actions/edictRune.md#edictruneresponse) \| [`TransferBTCResponse`](../../root/actions/transferBTC.md#transferbtcresponse) \>

BTC transaction response
