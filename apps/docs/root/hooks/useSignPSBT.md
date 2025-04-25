# useSignPSBT

Signs a PSBT with the given parameters. Optionally, it can broadcast the transaction.

## Import

```ts
import { useSignPSBT } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function SignPSBT() {
  const { data, signPSBT, error, loading } = useSignPSBT();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{data.tx.id}</p>
      <button
        onClick={() =>
          signPSBT({
            psbt: "cHNidP8BAHECAAAA...",
            signInputs: {
              "02c6047f9441ed7d6d3045406e95c07cd85a4697e2e6e5d1b1e7e6e5d1b1e7e6":
                [0],
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
