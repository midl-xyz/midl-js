# useRunes

Gets the runes for an address, with optional limit and offset

## Import

```ts
import { useRunes } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Runes () {
    const { data, error, loading } = useRunes({
        address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
        {data.runes.map(rune => (
            <div key={rune.id}>
                <p>{rune.id}</p>
            </div>
        ))}
        </div>
    );
    }

}
```
