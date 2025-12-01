# Send Bitcoin

Midl.js provides a simple way to send Bitcoin and Runes.

## Usage

### 1. Configure the app

Follow the [Connect Wallet](connect-wallet.md) guide to configure the app.

### 2. Create a component to send Bitcoin

::: code-group

```tsx [SendBitcoin.tsx]
import { useTransferBTC, useEdictRune } from "@midl/react";

export function SendBitcoin() {
  const { transferBTC, data: btcData } = useTransferBTC();
  const { edictRune, data: runeData } = useEdictRune();

  const sendBitcoin = async () => {
    transferBTC({
      transfers: [
        {
          amount: 10000,
          receiver: "bcrt1qquv9lg5g2r4jkr0ahun0ddfg5xntxjelwjpnuw",
        },
      ],
      publish: true,
    });
  };

  const sendRune = async () => {
    edictRune({
      transfers: [
        {
          runeId: "rune1", // Your rune ID
          amount: 10000n,
          receiver: "bcrt1qquv9lg5g2r4jkr0ahun0ddfg5xntxjelwjpnuw",
        },
      ],
      publish: true,
    });
  };

  return (
    <div>
      <button type="button" onClick={sendBitcoin}>
        Send Bitcoin
      </button>

      <button type="button" onClick={sendRune}>
        Send Rune
      </button>

      {btcData && <div>{JSON.stringify(btcData)}</div>}
      {runeData && <div>{JSON.stringify(runeData)}</div>}
    </div>
  );
}
```

:::

### 3. Add the component to the app

::: code-group

```tsx{4,15} [YourApp.tsx]
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { useAccounts } from "@midl/react";
import { SendBitcoin } from "./SendBitcoin";

export function YourApp() {
  const { isConnected } = useAccounts();

  return (
    <div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <>
          <ConnectedAccounts />
          <SendBitcoin />
        </>
      )}
    </div>
  );
}
```
