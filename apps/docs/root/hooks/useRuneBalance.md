# useRuneBalance

Gets the balance of a rune for an address. See [getRuneBalance](../actions/getRuneBalance) for more information.

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

  return <div>Rune Balance: {runeBalance}</div>;
}
```
