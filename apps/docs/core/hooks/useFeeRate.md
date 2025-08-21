# useFeeRate

Gets the current fee rate for Bitcoin transactions.

## Import

```ts
import { useFeeRate } from "@midl/react";
```

## Example

```tsx
function FeeRate() {
  const { feeRate, isLoading, error } = useFeeRate();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Fee Rate: {feeRate}</div>;
}
```

## Parameters

| Name   | Type              | Description                                                    |
| ------ | ----------------- | -------------------------------------------------------------- |
| query  | `UseQueryOptions` | (optional) Query options for react-query.                      |
| config | `Config`          | (optional) Custom config to override the default from context. |

## Returns

| Name    | Type                                                             | Description                                           |
| ------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| feeRate | [`GetFeeRateResponse`](../actions/getFeeRate#getfeerateresponse) | The current fee rate response schema                  |
| ...rest | object                                                           | Additional query state (e.g. isLoading, error, etc.). |
