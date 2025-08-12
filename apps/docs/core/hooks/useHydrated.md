# useHydrated

Checks if the configuration store has been hydrated (i.e., loaded from persistent storage).

## Import

```ts
import { useHydrated } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function App() {
  const hydrated = useHydrated();

  if (!hydrated) return <div>Loading...</div>;

  return <div>App is hydrated!</div>;
}
```

## Parameters

| Name   | Type   | Description                                                    |
| ------ | ------ | -------------------------------------------------------------- |
| config | Config | (optional) Custom config to override the default from context. |

## Returns

| Type    | Description                                  |
| ------- | -------------------------------------------- |
| boolean | Whether the config store is hydrated or not. |
