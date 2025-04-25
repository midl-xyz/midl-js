# Sign Message

Message signing is a way to prove that you own a particular public key without revealing the private key. This is useful for proving ownership of an address or for signing messages in a secure way.

## Usage

### 1. Configure the app

Follow the [Connect Wallet](connect-wallet.md) guide to configure the app.

### 2. Sign a message

```tsx [SignMessage.tsx]
import { SignMessageProtocol } from "@midl-xyz/midl-js-core";
import { useAccounts, useSignMessage } from "@midl-xyz/midl-js-react";

export function SignMessage() {
  const { signMessage, data } = useSignMessage();
  const { ordinalsAccount } = useAccounts();

  const sign = () => {
    signMessage({
      message: "Hello, world!",
      protocol: SignMessageProtocol.Bip322,
      address: ordinalsAccount?.address,
    });
  };

  return (
    <div>
      <button type="button" onClick={sign}>
        Sign Message
      </button>

      {data && (
        <div>
          <code>{JSON.stringify(data, null, 2)}</code>
        </div>
      )}
    </div>
  );
}
```

### 3. Add the component to the app

::: code-group

```tsx{4,15} [YourApp.tsx]
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { useAccounts } from "@midl-xyz/midl-js-react";
import { SignMessage } from "./SignMessage";

export function YourApp() {
  const { isConnected } = useAccounts();

  return (
    <div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <>
          <ConnectedAccounts />
          <SignMessage />
        </>
      )}
    </div>
  );
}
```
