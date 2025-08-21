---
title: Getting Started
order: 1
---

# Getting Started

MIDL.js is a framework for building decentralized applications on Bitcoin, powered by the MIDL Protocol. The MIDL Protocol extends Bitcoin's capabilities, enabling smart contracts and advanced application logic on the Bitcoin network.

It provides a set of tools and libraries to help developers build, test, and deploy smart contracts and Bitcoin-native apps.

## Installation

The executor packages allow you to interact with and deploy contracts on the MIDL Protocol from your JavaScript or React application. Install MIDL.js executor packages via your package manager of choice.

::: code-group

```bash [pnpm]
pnpm add @midl/executor @midl/executor-react @midl/connectors @midl/core @midl/react
```

```bash [npm]
npm install @midl/executor @midl/executor-react @midl/connectors @midl/core @midl/react
```

```bash [yarn]
yarn add @midl/executor @midl/executor-react @midl/connectors @midl/core @midl/react
```

:::


### Override `viem` versions

::: warning This step is required to ensure compatibility with MIDL.js executor. If you skip this step, some features required by MIDL.js may not work as expected.
:::

To ensure compatibility with MIDL.js executor, you need to override the version of
`viem` in your `package.json`. The patched version of `viem` provides additional
functionality required by MIDL.js executor, such as setting the transaction type,
fees, adding `estimateGasMulti` method and more.

::: code-group

```json [package.json(pnpm)]
{
  "pnpm": {
    "overrides": {
      "viem": "npm:@midl/viem"
    }
  }
}
```

```json [package.json(npm)]
{
  "overrides": {
    "viem": "npm:@midl/viem"
  }
}
```

```json [package.json(yarn)]
{
  "resolutions": {
    "viem": "npm:@midl/viem"
  }
}
```

:::

## Example

Add `WagmiMidlProvider` to provide the necessary context for the executor to work.

::: code-group

```tsx [app.tsx]
import { MidlProvider } from '@midl/react';
import { WagmiMidlProvider } from "@midl/executor-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {midlConfig} from './midlConfig';

const queryClient = new QueryClient();

function App({ children }: { children: React.ReactNode }) {
    return (
        <MidlProvider config={midlConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiMidlProvider>
              {children}
            </WagmiMidlProvider>
          </QueryClientProvider>
        </MidlProvider>
    );
}
```

```ts [midlConfig.ts]
import {
  createConfig,
  regtest,
} from "@midl/core";
import { xverseConnector } from "@midl/connectors";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  persist: true,
});
```
:::

## Next Steps

- [Guide: Deploying Your First Contract](./guides/deploy-contract.md)
- [Guide: Interacting with Contracts](./guides/interact-contract.md)

