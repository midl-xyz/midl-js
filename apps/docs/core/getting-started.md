---
title: Getting Started
order: 1
---

# Getting Started

Install MIDL.js via your package manager of choice.

::: code-group

```bash [pnpm]
pnpm add @midl/core @midl/react @midl/connectors
```

```bash [npm]
npm install @midl/core @midl/react @midl/connectors
```

```bash [yarn]
yarn add @midl/core @midl/react @midl/connectors
```

:::

## Integration

Create and export a new MIDL.js config file in your project. And wrap your app with the Midl.js context provider.

::: code-group

```ts [midl.config.ts]
import { createConfig, regtest } from "@midl/core";
import { xverseConnector } from "@midl/connectors";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  persist: true,
});
```

```tsx [app.tsx]
import { MidlProvider } from "@midl/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { midlConfig } from "./midl.config";

function App() {
  return (
    <MidlProvider config={midlConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MidlProvider>
  );
}
```

:::

## Usage

Use MIDL.js hooks to interact with the blockchain.

> [!TIP]
> Use the [SatoshiKit](../satoshi-kit/index.md) to have a more complete experience with MIDL.js.

::: code-group

```tsx [index.tsx]
import { useConnect, useAccounts } from "@midl/react";

function Page() {
  const { connect, connectors } = useConnect();
  const { accounts, isConnected } = useAccounts();

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
