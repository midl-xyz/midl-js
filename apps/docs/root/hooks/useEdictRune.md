# useEdictRune

Edicts (transfers) one or more runes to one or more receivers

## Import

```ts
import { useEdictRune } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function TransferRune() {
  const { edictRune, error } = useEdictRune();

  const onClick = () => {
    edictRune({
      transfers: [
        {
          amount: 100000000n,
          runeId: "1:1",
          receiver: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        },
      ],
    });
  };

  if (error) return <div>Error: {error.message}</div>;

  return <div>Edict Rune: {edictRune}</div>;
}
```
