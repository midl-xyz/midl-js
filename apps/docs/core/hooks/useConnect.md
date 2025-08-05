# useConnect

Connects to a wallet using the specified connector.

## Import

```ts
import { useConnect } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Page() {
  const { connect, connectors } = useConnect();

  return (
    <div>
      {connectors.map(connector => (
        <button
          key={connector.name}
          onClick={() =>
            connect({
              id: connector.id,
            })
          }
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
```

## Parameters

| Name     | Type                                                   | Description                                                    |
| -------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| mutation | `UseMutationOptions`                                   | (optional) Mutation options for react-query.                   |
| config   | `Config`                                               | (optional) Custom config to override the default from context. |
| ...rest  | [`ConnectParams`](../actions/connect.md#connectparams) | Additional connect parameters.                                 |

## Returns

| Name         | Type                                                    | Description                                                                   |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| connect      | `(variables: ConnectVariables) => void`                 | Function to initiate connection.                                              |
| connectAsync | `(variables: ConnectVariables) => Promise<ConnectData>` | Function to asynchronously connect.                                           |
| connectors   | `Array<ConnectorWithMetadata>`                          | The list of available connectors.                                             |
| ...rest      | `object`                                                | Other properties from the mutation object, such as `isLoading`, `error`, etc. |

### ConnectVariables

| Name | Type   | Description                     |
| ---- | ------ | ------------------------------- |
| id   | string | The id of the connector to use. |

