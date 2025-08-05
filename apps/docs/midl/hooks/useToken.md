# useToken

Returns the Rune associated with a given EVM address.

---

## Parameters

| Name             | Type             | Description                                     |
| ---------------- | ---------------- | ----------------------------------------------- |
| `address`        | `Address`        | The EVM address for which to retrieve the Rune. |
| `options`        | `UseERC20Params` | Optional parameters for the contract call.      |
| `options.query`  | `object`         | Custom query options for the contract call.     |
| `options.config` | `Config`         | Custom configuration to override the default.   |

## Returns

| Name            | Type                    | Description                                        |
| --------------- | ----------------------- | -------------------------------------------------- |
| `state`         | `UseRuneReturn`         | State returned by the `useRune` hook.              |
| `bytes32State`  | `UseReadContractReturn` | State from the `useReadContract` hook for Rune ID. |
| `bytes32RuneId` | `string \| undefined`   | The bytes32 representation of the Rune ID.         |
| `rune`          | `Rune \| undefined`     | The corresponding Rune data.                       |

## Variables

| Name     | Type     | Description          |
| -------- | -------- | -------------------- |
| `runeId` | `string` | The decoded Rune ID. |

## Example

```typescript
const { rune } = useToken('0xabc123...');
if (rune) {
  console.log(`Rune Name: ${rune.name}`);
}
```
