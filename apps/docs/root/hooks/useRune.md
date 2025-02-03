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

  return <div>Rune: {rune.name}</div>;
}
```
