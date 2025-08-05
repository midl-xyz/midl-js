# useRune

Gets a rune by its ID. See [getRune](../actions/getRune.md) for more information.

## Import

```ts
import { useRune } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Rune() {
  const { rune, isLoading, error } = useRune({
    runeId: "1:1",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Rune: {rune?.name}</div>;
}
```

## Parameters

| Name   | Type              | Description                                                    |
| ------ | ----------------- | -------------------------------------------------------------- |
| runeId | string            | The ID of the rune to fetch.                                   |
| query  | `UseQueryOptions` | (optional) Query options for react-query.                      |
| config | `Config`          | (optional) Custom config to override the default from context. |

## Returns

| Name    | Type                                                       | Description                                           |
| ------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| rune    | [`GetRuneResponse`](../actions/getRune.md#getruneresponse) | The fetched rune data.                                |
| ...rest | object                                                     | Additional query state (e.g. isLoading, error, etc.). |
