# useRunes

Gets the runes for an address, with optional limit and offset. If no address is provided, the address from the ordinals account will be used.

## Import

```ts
import { useRunes } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Runes () {
    const { runes, isLoading, error } = useRunes({
        // address is optional; will use ordinals account address if not provided
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
        {runes?.map(rune => (
            <div key={rune.id}>
                <p>{rune.id}</p>
            </div>
        ))}
        </div>
    );
}
```

## Parameters

| Name    | Type              | Description                                                                                |
| ------- | ----------------- | ------------------------------------------------------------------------------------------ |
| address | string            | (optional) Address to fetch runes for. If not provided, uses the ordinals account address. |
| limit   | number            | (optional) Limit the number of runes returned (default: 20).                               |
| offset  | number            | (optional) Offset for pagination (default: 0).                                             |
| query   | `UseQueryOptions` | (optional) Query options for react-query.                                                  |
| config  | `Config`          | (optional) Custom config to override the default from context.                             |

## Returns

| Name    | Type                                                          | Description                                           |
| ------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| runes   | [`GetRunesResponse`](../actions/getRunes.md#getrunesresponse) | The list of fetched runes.                            |
| ...rest | object                                                        | Additional query state (e.g. isLoading, error, etc.). |
