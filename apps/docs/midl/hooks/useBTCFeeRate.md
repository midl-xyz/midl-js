# useBTCFeeRate

Fetches the BTC fee rate defined in the Executor contract.

## Import

```ts
import { useBTCFeeRate } from "@midl/executor-react";
```

## Example

```ts
const { data: feeRate } = useBTCFeeRate();
```

## Parameters

| Name     | Type                         | Description                                              |
| -------- | ---------------------------- | -------------------------------------------------------- |
| `query`  | `UseQueryOptions` (optional) | React Query options (minus `queryFn` and `queryKey`).     |
| `config` | `Config` (optional)          | Custom configuration to override the default.            |

## Returns

Returns a React Query result object with `data`, `isLoading`, `error`, and other query state fields.
