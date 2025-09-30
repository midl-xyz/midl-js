# useBlockNumber

Fetches the latest block number from the configured network and can optionally poll for updates at a specified interval.

## Import

```ts
import { useBlockNumber } from "@midl/react";
```

## Example

```tsx
function Page() {
  const { blockNumber } = useBlockNumber();

  return (
    <div>
      <h2>Block Number</h2>
      <p>{blockNumber}</p>
    </div>
  );
}
```

## Parameters

| Name   | Type                   | Description |
| ------ | ---------------------- | ----------- |
| params | `UseBlockNumberParams` |             |

### UseBlockNumberParams

| Name            | Type           | Description                                                                         |
| --------------- | -------------- | ----------------------------------------------------------------------------------- |
| watch           | `boolean`      | If true, the block number will be polled at the specified interval.                 |
| pollingInterval | `number`       | The interval in milliseconds at which to poll the block number. Default is `30_000` |
| query           | `QueryOptions` | The query options to pass to the underlying `useQuery` hook.                        |
| config          | `Config`       | (optional) Config object to use instead of the one from context.                    |

## Returns

| Name        | Type     | Description             |
| ----------- | -------- | ----------------------- |
| blockNumber | `number` | The latest block number |
| ...rest     |          | Additional query state  |
