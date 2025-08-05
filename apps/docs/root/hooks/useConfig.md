# useConfig

Retrieves the current configuration.

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

## Parameters

| Name         | Type   | Description                                                    |
| ------------ | ------ | -------------------------------------------------------------- |
| customConfig | Config | (optional) Custom config to override the default from context. |

## Returns

| Name   | Type                               | Description              |
| ------ | ---------------------------------- | ------------------------ |
| config | [`Config`](../reference.md#config) | The configuration object |
