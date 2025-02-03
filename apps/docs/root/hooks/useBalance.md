# useBalance

Fetches the balance of a given address.

## Import

```ts
import { useBalance } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Balance() {
  const { address } = useAddress();
  const { balance, isLoading, error } = useBalance(address);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Balance: {balance}</div>;
}
```

## Parameters

| Name    | Type           | Description                |
| ------- | -------------- | -------------------------- |
| address | `string`       | The address to get balance |
| query   | `QueryOptions` | `useQuery` options         |

## Returns

| Name    | Type     | Description             |
| ------- | -------- | ----------------------- |
| balance | `number` | The balance in satoshis |
| ...rest | `object` | `useQuery` return value |
