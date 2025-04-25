# useAccounts

Provides access to the connected user's accounts

## Import

```ts
import { useAccounts } from "@midl-xyz/midl-js-react";
```

## Example

```tsx
function Page() {
  const { accounts, isConnected } = useAccounts();

  return (
    <div>
      {isConnected && (
        <div>
          <h2>Accounts</h2>
          <ul>
            {accounts.map(account => (
              <li key={account}>{account}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Returns

| Name            | Type                                                | Description                                      |
| --------------- | --------------------------------------------------- | ------------------------------------------------ |
| accounts        | [`Account[]`](../reference.md#account) \| `null`    | The list of user accounts                        |
| ordinalsAccount | [`Account`](../reference.md#account) \| `undefined` | The ordinals account (p2tr)                      |
| paymentAccount  | [`Account`](../reference.md#account) \| `undefined` | The payment account (p2wpkh)                     |
| connector       | `Connector \| undefined`                            | The current connection                           |
| isConnecting    | `boolean`                                           | Indicates if a connection is in progress         |
| isConnected     | `boolean`                                           | Indicates if the connection has been established |
| status          | `string`                                            | The current connection status                    |
| network         | `BitcoinNetwork \| undefined`                       | The connected network                            |
| ...rest         |                                                     | Additional query state provided by `useQuery`    |
