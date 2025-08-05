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
      name: "MY•RUNE",
      receiver: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      amount: 100000000n,
      // ...other params
    });
  };

  if (error) return <div>Error: {error.message}</div>;

  return <button onClick={onClick}>Etch Rune</button>;
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

### EtchRuneVariables

See [`EtchRuneParams`](../actions/etchRune.md#etchruneparams) for the full list of parameters.

## Returns

| Name          | Type                                                      | Description                                              |
| ------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| etchRune      | `(variables: EtchRuneVariables) => void`                  | Function to initiate the Etch Rune action.               |
| etchRuneAsync | `(variables: EtchRuneVariables) => Promise<EtchRuneData>` | Function to asynchronously execute the Etch Rune action. |
| ...rest       | object                                                    | Additional mutation state (e.g. isLoading, error, etc.). |
