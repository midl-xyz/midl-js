# useEtchRune

Etches (mints) a rune on Bitcoin. See [etchRune](../actions/etchRune) for more details.

## Import

```ts
import { useEtchRune } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function MintRune() {
  const { etchRune, error } = useEtchRune();

  const onClick = () => {
    etchRune({
      amount: 100000000n,
      name: "My Rune",
    });
  };

  if (error) return <div>Error: {error.message}</div>;

  return <div>Etch Rune: {etchRune}</div>;
}
```
