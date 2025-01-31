# useConfig

Retrieves the current configuration

## Import

```ts
import { useConfig } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Config() {
  const config = useConfig();

  return <div>Config: {JSON.stringify(config)}</div>;
}
```

## Returns

| Name   | Type                               | Description              |
| ------ | ---------------------------------- | ------------------------ |
| config | [`Config`](../reference.md#config) | The configuration object |
