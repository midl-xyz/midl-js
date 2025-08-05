# useSignPSBT

Signs a PSBT with the given parameters. Optionally, it can broadcast the transaction.

## Import

```ts
import { useSignPSBT } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function SignPSBT() {
  const { signPSBT, isLoading, error, data } = useSignPSBT();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data?.tx?.id}</p>
      <button
        onClick={() =>
          signPSBT({
            psbt: "cHNidP8BAHECAAAA...",
            signInputs: {
              "02c6047f9441ed7d6d3045406e95c07cd85a4697e2e6e5d1b1e7e6e5d1b1e7e6": [0],
            },
            publish: true,
          })
        }
      >
        Sign PSBT
      </button>
    </div>
  );
}
```

## Parameters

| Name     | Type                 | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| mutation | `UseMutationOptions` | (optional) Mutation options for react-query.                   |
| config   | `Config`             | (optional) Custom config to override the default from context. |

### SignPSBTVariables

See [`SignPSBTParams`](../actions/signPSBT.md#signpsbtparams) for the full list of parameters.

## Returns

| Name          | Type                                                      | Description                                              |
| ------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| signPSBT      | `(variables: SignPSBTVariables) => void`                  | Function to initiate PSBT signing.                       |
| signPSBTAsync | `(variables: SignPSBTVariables) => Promise<SignPSBTData>` | Function to asynchronously sign PSBT.                    |
| ...rest       | object                                                    | Additional mutation state (e.g. isLoading, error, etc.). |
