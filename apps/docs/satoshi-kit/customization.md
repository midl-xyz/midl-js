---
order: 2
---

# Customization

::: warning
This feature is currently in development, at the moment you can only customize the `ConnectButton` component.
:::


##  ConnectButton


You can customize the `ConnectButton` component by passing the `hideBalance`, `hideAvatar`, and `hideAddress` props. This will allow you to hide the balance, avatar, and address in the account button. Also you can pass a function as a child to the `ConnectButton` component, which will receive the `openConnectDialog`, `openAccountDialog`, `isConnected`, and `isConnecting` props. This function should return a React node that will be rendered as the button content.

### Props

| Name              | Type      | Description                                                                                   |
| ----------------- | --------- | --------------------------------------------------------------------------------------------- |
| `hideBalance`     | `boolean` | If true, the balance will be hidden
| `hideAvatar`      | `boolean` | If true, the avatar will be hidden in the account button                                       |
| `hideAddress`     | `boolean` | If true, the address will be hidden
| `children`        | `function`| A function that receives the `openConnectDialog`, `openAccountDialog`, `isConnected`, and `isConnecting` props. This function should return a React node that will be rendered as the button content. |
| `beforeConnect`   | `function`| A function that will be called before the connect dialog is opened. It receives the connector id as an argument and can return a promise or void. This can be used to perform any actions before the user connects their wallet. |


::: tip
You can use the `beforeConnect` prop to perform any actions before the user connects their wallet. For example, you can add analytics tracking, change wallet-specific configurations or any other custom logic.
:::


```tsx
import { ConnectButton } from "@midl-xyz/satoshi-kit";

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