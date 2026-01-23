# addRequestAddAssetIntention

> **addRequestAddAssetIntention**(`config`, `params`, `options?`): `Promise<TransactionIntention>`

Creates an intention to request adding a new ERC20 asset backed by a Rune. This prepares an EVM transaction that calls `requestAddAsset` and includes the required Rune deposit for the mapping fee.

## Import

```ts
import { addRequestAddAssetIntention } from "@midl/executor";
```

## Example

```ts
const intention = await addRequestAddAssetIntention(config, {
  address: "0x0000000000000000000000000000000000000000",
  runeId: "840000:1",
  amount: 1000000n,
});
```

## Parameters

| Name      | Type                                                       | Description                       |
| --------- | ---------------------------------------------------------- | --------------------------------- |
| `config`  | `Config`                                                   | The configuration object.         |
| `params`  | [`AddRequestAddAssetIntentionParams`](#addrequestaddassetintentionparams) | Parameters for the request.       |
| `options` | [`AddRequestAddAssetIntentionOptions`](#addrequestaddassetintentionoptions) (optional) | Optional signing configuration. |

### AddRequestAddAssetIntentionParams

| Name     | Type            | Description                                |
| -------- | --------------- | ------------------------------------------ |
| `address` | `0x${string}`   | ERC20 contract address.                    |
| `runeId` | `string`        | The rune ID to associate with the asset.   |
| `amount` | `bigint`        | Amount of the rune to deposit.             |

### AddRequestAddAssetIntentionOptions

| Name   | Type               | Description                                  |
| ------ | ------------------ | -------------------------------------------- |
| `from` | `string` (optional) | BTC address used to sign the intention.      |

## Returns

`Promise<TransactionIntention>` — The created transaction intention.
