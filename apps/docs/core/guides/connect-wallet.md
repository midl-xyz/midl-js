# Connect Wallet

::: tip
We recommend to start with [SatoshiKit](../../satoshi-kit/index.md) to make it easier to connect to wallets and manage accounts.
:::


The ability to connect a wallet is a crucial part of interacting with the blockchain. MIDL.js provides a simple way to connect to a wallet.


## Usage

### 1. Create a Configuration Object


In the example below we are using `xverseConnector` to connect to the Xverse wallet. You can use any connector from `@midl-xyz/midl-js-connectors` or create your own.

::: code-group

```ts [midlConfig.ts]
import {
  createConfig,
  regtest,
} from "@midl-xyz/midl-js-core";
import { xverseConnector } from "@midl-xyz/midl-js-connectors";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  persist: true, // Enable persistence to store the wallet connection state
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
import { useAccounts } from "@midl-xyz/midl-js-react";

export function YourApp() {
  const { isConnected } = useAccounts();

  return (
    <div>
      {!isConnected && <ConnectWallet />}
      {isConnected && (
        <>
          <ConnectedAccounts />
        </>
      )}
    </div>
  );
}
```

## Create your own Connector

You can create your own connector by implementing the `Connector` interface and using the `createConnector` function.

```ts
import {
	type CreateConnectorFn,
  type Connector,
	createConnector,
} from "@midl-xyz/midl-js-core";

export const myCustomConnector: CreateConnectorFn = ({ metadata } = {}) =>
	createConnector(
		{
			metadata: {
				name: "Phantom",
			},
			create: () => new MyCustomConnectorFactory(), 
		},
		metadata,
	);

class MyCustomConnectorFactory extends Connector {
  // Implement the required methods like connect, signMessage, etc.
}
```

### Connector Interface

Defined in [core/src/connectors/createConnector.ts](https://github.com/midl-xyz/midl-js/blob/main/packages/core/src/connectors/createConnector.ts)

```ts
export interface Connector {
	readonly id: string;
	connect(params: ConnectorConnectParams): Promise<Account[]>;
	signMessage(
		params: SignMessageParams,
		network: BitcoinNetwork,
	): Promise<SignMessageResponse>;
	signPSBT(
		params: Omit<SignPSBTParams, "publish">,
		network: BitcoinNetwork,
	): Promise<Omit<SignPSBTResponse, "txId">>;

	beforeDisconnect?(): Promise<void>;
	switchNetwork?(network: BitcoinNetwork): Promise<Account[]>;
	addNetwork?(networkConfig: NetworkConfig): Promise<void>;
}
```
