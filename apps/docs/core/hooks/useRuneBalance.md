# useRuneBalance

Gets the balance of a rune for an address. See [getRuneBalance](../actions/getRuneBalance.md) for more information.

## Import

```ts
import { useRuneBalance } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function RuneBalance() {
  const { balance, isLoading, error } = useRuneBalance({
    address: "bcrt1qj0...0zq",
    runeId: "1:1",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Rune Balance: {balance}</div>;
}
```

## Parameters

| Name    | Type              | Description                                                    |
| ------- | ----------------- | -------------------------------------------------------------- |
| address | string            | (optional) Address to fetch the rune balance for.              |
| runeId  | string            | The ID of the rune to fetch the balance for.                   |
| query   | `UseQueryOptions` | (optional) Query options for react-query.                      |
| config  | `Config`          | (optional) Custom config to override the default from context. |

## Returns

| Name    | Type                                                                            | Description                                           |
| ------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| balance | [`GetRuneBalanceResponse`](../actions/getRuneBalance.md#getrunebalanceresponse) | The balance of the specified rune.                    |
| ...rest | object                                                                          | Additional query state (e.g. isLoading, error, etc.). |
