# Connect Wallet

The ability to connect a wallet is a crucial part of interacting with the blockchain. MIDL.js provides a simple way to connect to a wallet.

You can find the example in [apps/docs/examples](https://github.com/midl-xyz/midl-js/tree/main/apps/docs/examples)

## Usage

### 1. Create a Configuration Object

::: code-group

```ts [midlConfig.ts]
import { createConfig, leather, regtest } from "@midl-xyz/midl-js-core";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [leather()],
});
```

:::

### 2. Wrap the App with the Provider

::: code-group

```tsx [App.tsx]
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { midlConfig } from "./midlConfig";

function App() {
  return (
    <MidlProvider config={midlConfig}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </MidlProvider>
  );
}
```

```ts [query-client.ts]
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

:::

### 3. Add Connect Wallet Button

::: code-group

```tsx [ConnectWallet.tsx]
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { useConnect } from "@midl-xyz/midl-js-react";

export function ConnectWallet() {
  const { connectors, connect } = useConnect({
    purposes: [AddressPurpose.Ordinals],
  });

  return (
    <div>
      {connectors.map(connector => (
        <button
          type="button"
          key={connector.name}
          onClick={() => connect({ id: connector.id })}
        >
          Connect with {connector.name}
        </button>
      ))}
    </div>
  );
}
```

:::

### 4. Display Connected Accounts

::: code-group

```tsx [ConnectedAccounts.tsx]
import { useAccounts } from "@midl-xyz/midl-js-react";

export function ConnectedAccounts() {
  const { accounts } = useAccounts();

  return (
    <div>
      {accounts?.map(account => (
        <div key={account.address}>
          <div>Address: {account.address}</div>
          <div>Public Key: {account.publicKey}</div>
        </div>
      ))}
    </div>
  );
}
```

:::

### 5. Put it all together

```tsx
import { ConnectWallet } from "./ConnectWallet";
import { ConnectedAccounts } from "./ConnectedAccounts";

export function YourApp() {
  return (
    <div>
      <ConnectWallet />
      <ConnectedAccounts />
    </div>
  );
}
```

## Create your own Connector

You can create your own connector by implementing the `Connector` interface.

```ts
import { Connector, createConnector } from "@midl-xyz/midl-js-core";

class MyConnector implements Connector {
  // Implement the Connector interface
}

export const myConnector = (options: MyConnectorOptions) => {
  return createConnector(config => {
    return new MyConnector(config, MyConnectorOptions);
  });
};
```

### Connector Interface

Defined in [core/src/connectors/createConnector.ts](https://github.com/midl-xyz/midl-js/blob/main/packages/core/src/connectors/createConnector.ts)

```ts
export interface Connector {
  readonly id: string;
  readonly name: string;
  connect(params: ConnectParams): Promise<Account[]>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<Account[]>;
  getNetwork(): Promise<BitcoinNetwork>;
  signMessage(params: SignMessageParams): Promise<SignMessageResponse>;
  signPSBT(
    params: Omit<SignPSBTParams, "publish">
  ): Promise<Omit<SignPSBTResponse, "txId">>;
}
```
