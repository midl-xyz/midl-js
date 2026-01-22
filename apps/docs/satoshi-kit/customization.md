---
order: 2
---

# Customization

::: warning
This feature is currently in development. Components and props may change.
:::


##  ConnectButton


You can customize the `ConnectButton` component by passing the `hideBalance`, `hideAvatar`, and `hideAddress` props. This will allow you to hide the balance, avatar, and address in the account button. Also you can pass a function as a child to the `ConnectButton` component, which will receive the `openConnectDialog`, `openAccountDialog`, `isConnected`, and `isConnecting` props. This function should return a React node that will be rendered as the button content.

### Props

| Name            | Type       | Description                                                                                                                                                                                                                      |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hideBalance`   | `boolean`  | If true, the balance will be hidden                                                                                                                                                                                              |
| `hideAvatar`    | `boolean`  | If true, the avatar will be hidden in the account button                                                                                                                                                                         |
| `hideAddress`   | `boolean`  | If true, the address will be hidden                                                                                                                                                                                              |
| `children`      | `function` | A function that receives the `openConnectDialog`, `openAccountDialog`, `isConnected`, and `isConnecting` props. This function should return a React node that will be rendered as the button content.                            |
| `beforeConnect` | `function` | A function that will be called before the connect dialog is opened. It receives the connector id as an argument and can return a promise or void. This can be used to perform any actions before the user connects their wallet. |


::: tip
You can use the `beforeConnect` prop to perform any actions before the user connects their wallet. For example, you can add analytics tracking, change wallet-specific configurations or any other custom logic.
:::


```tsx
import { ConnectButton } from "@midl/satoshi-kit";

export const CustomConnectButton = () => {
    return (
        <ConnectButton
            hideBalance={true}
            hideAvatar={true}
            hideAddress={true}
            beforeConnect={async (connectorId) => {
                console.log("before connect", connectorId);
            }}
        >
            {({ openConnectDialog, openAccountDialog, isConnected, isConnecting }) => (
                <button onClick={openConnectDialog}>
                    {isConnected ? "Connected" : "Connect"}
                </button>
            )}
        </ConnectButton>
    );
};
```

## AccountButton

`AccountButton` shows the current account, balance, and avatar. You can hide pieces of the UI or render your own content.

### Props

| Name          | Type       | Description                                                              |
| ------------- | ---------- | ------------------------------------------------------------------------ |
| `hideBalance` | `boolean`  | If true, hides the balance.                                              |
| `hideAvatar`  | `boolean`  | If true, hides the avatar.                                               |
| `hideAddress` | `boolean`  | If true, hides the address.                                              |
| `onClick`     | `function` | Click handler for the button.                                            |
| `children`    | `function` | Render prop receiving `{ balance, address }` and returning a React node. |

```tsx
import { AccountButton } from "@midl/satoshi-kit";

export const CustomAccountButton = () => (
  <AccountButton hideBalance>
    {({ address }) => <button>{address}</button>}
  </AccountButton>
);
```

## AccountDialog

`AccountDialog` shows connected accounts and provides a disconnect action.

### Props

| Name     | Type       | Description                       |
| -------- | ---------- | --------------------------------- |
| `open`   | `boolean`  | Whether the dialog is open.       |
| `onClose` | `function` | Called when the dialog closes.    |

```tsx
import { AccountDialog } from "@midl/satoshi-kit";

<AccountDialog open={isOpen} onClose={() => setIsOpen(false)} />;
```
