# useBalance

Fetches the balance of a given address or the default account if no address is provided.

## Import

```ts
import { useBalance } from "@midl/react";
```

## Example

```tsx
function Balance() {
  const { balance, isLoading, error } = useBalance();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Balance: {balance}</div>;
}
```

## Parameters

| Name    | Type              | Description                                                                                 |
| ------- | ----------------- | ------------------------------------------------------------------------------------------- |
| address | string            | (optional) The address to fetch the balance for. If not provided, uses the default account. |
| query   | `UseQueryOptions` | (optional) Query options for react-query.                                                   |
| config  | `Config`          | (optional) Config object to use instead of the one from context.                            |

## Returns

| Name    | Type   | Description                                     |
| ------- | ------ | ----------------------------------------------- |
| balance | number | The balance of the address (or 0 if not found). |
| ...rest | object | Additional query state from useQuery.           |
