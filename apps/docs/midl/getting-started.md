---
title: Getting Started
order: 0
---

# Getting Started

MIDL is a framework for building decentralized applications on Bitcoin. It provides a set of tools and libraries to help developers build, test, and deploy smart contracts on the MIDL Protocol.

## Installation

Install Midl.js executor packages via your package manager of choice.

::: code-group

```bash [pnpm]
pnpm add @midl-xyz/midl-js-executor @midl-xyz/midl-js-executor-react
```

```bash [npm]
npm install @midl-xyz/midl-js-executor @midl-xyz/midl-js-executor-react
```

```bash [yarn]
yarn add @midl-xyz/midl-js-executor @midl-xyz/midl-js-executor-react
```

:::

### Add Wagmi and viem

MIDL executor packages work alongside [Wagmi](https://wagmi.sh) to provide a seamless experience for developers.

::: code-group

```bash [pnpm]
pnpm add wagmi
```

```bash [npm]
npm install wagmi
```

```bash [yarn]
yarn add wagmi
```

:::

#### Override `viem` versions

::: warning
This step is required to ensure compatibility with MIDL executor.
:::

To ensure compatibility with MIDL executor, you need to override the version of `viem` in your `package.json`.
Patched version of `viem` provide additional functionality required by MIDL executor, such as setting the transaction type, fees, adding `estimateGasMulti` method and more.

::: code-group

```json [package.json(pnpm)]
{
  "pnpm": {
    "overrides": {
      "viem": "npm:@midl-xyz/midl-viem"
    }
  }
}
```

```json [package.json(npm)]
{
  "overrides": {
    "viem": "npm:@midl-xyz/midl-viem"
  }
}
```

```json [package.json(yarn)]
{
  "resolutions": {
    "viem": "npm:@midl-xyz/midl-viem"
  }
}
```

:::

## Integration

Add `WagmiMidlProvider` to provide the necessary context for the executor to work.

::: code-group

```tsx{2,16} [app.tsx]
import { MidlProvider } from '@midl-xyz/midl-js-react';
import { WagmiMidlProvider } from "@midl-xyz/midl-js-executor-react";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {midlConfig} from './midlConfig';
import {wagmiConfig} from './wagmiConfig';

const queryClient = new QueryClient();

function App({ children }: { children: React.ReactNode }) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <MidlProvider config={midlConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiMidlProvider />
            {children}
          </QueryClientProvider>
        </MidlProvider>
      </WagmiProvider>
    );
}


```

```ts [midlConfig.ts]
import { createConfig, regtest, leather } from "@midl-xyz/midl-js-core";

export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [leather()],
  persist: true,
});
```

```ts [wagmiConfig.ts]
import { midlRegtest } from "@midl-xyz/midl-js-executor";
import type { Chain } from "viem";
import { createConfig, http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [
    {
      ...midlRegtest,
      rpcUrls: {
        default: {
          http: [midlRegtest.rpcUrls.default.http[0]],
        },
      },
    } as Chain,
  ],
  transports: {
    [midlRegtest.id]: http(midlRegtest.rpcUrls.default.http[0]),
  },
});
```

:::
