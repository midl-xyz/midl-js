# Sign PSBT

Signin a PSBT is a common operation when working with Bitcoin transactions. This guide will show you how to sign a PSBT using MIDL.js.

## Usage

### 1. Configure the app

Follow the [Connect Wallet](connect-wallet.md) guide to configure the app.

### 2. Sign a PSBT

```tsx [SignPSBT.tsx]
import { useSignPSBT, useAccounts } from "@midl-xyz/midl-js-react";
import * as bitcoin from "bitcoinjs-lib";

export function SignPSBT() {
  const { signPSBT, data } = useSignPSBT();
  const { ordinalsAccount } = useAccounts();

  const sign = () => {
    if (!ordinalsAccount) {
      return;
    }

    const psbt = new bitcoin.Psbt();

    psbt.addInput({
      // Add input data here
    });

    // Form the PSBT

    signPSBT({
      psbt: psbt.toBase64(),
      signInputs: {
        [ordinalsAccount.publicKey]: [0],
      },
    });
  };

  return (
    <div>
      <button type="button" onClick={sign}>
        Sign PSBT
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
import { SignPSBT } from "./SignPSBT";

export function YourApp() {
  const { isConnected } = useAccounts();

  return (
    <div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <>
          <ConnectedAccounts />
          <SignPSBT />
        </>
      )}
    </div>
  );
}
```
