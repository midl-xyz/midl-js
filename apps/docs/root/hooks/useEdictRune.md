# useEdictRune

Edicts (transfers) one or more runes to one or more receivers. The transaction will only be broadcast if `publish` is set to `true` in the parameters.

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
      publish: true, // Set to true to broadcast the transaction
    });
  };

  if (error) return <div>Error: {error.message}</div>;

  return <button onClick={onClick}>Edict Rune</button>;
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

## Returns

| Name           | Type                                                        | Description                                               |
| -------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| edictRune      | `(variables: EdictRuneVariables) => void`                   | Function to initiate the Edict Rune action.               |
| edictRuneAsync | `(variables: EdictRuneVariables) => Promise<EdictRuneData>` | Function to asynchronously execute the Edict Rune action. |
| ...rest        | object                                                      | Additional mutation state (e.g. isLoading, error, etc.).  |

### EdictRuneVariables

See [`EdictRuneParams`](../actions/edictRune.md#edictruneparams) for the full list of parameters.
