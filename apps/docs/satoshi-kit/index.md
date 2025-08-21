---
title: Overview
order: 0
---

# SatoshiKit

SatosiKit is a modern toolkit designed to help developers easily integrate Bitcoin wallets into their applications. It provides a set of components and utilities that simplify the process of connecting your favorite Bitcoin wallets and authenticating users.


Just click the button below to see an example of how to use SatoshiKit in your application.


<div ref="el" class="vp-raw"/>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import { Example } from '../satoshi-kit/Example'

const el = ref()
onMounted(() => {
  const root = createRoot(el.value)
  root.render(createElement(Example, {}, null))
})
</script>

## Installation

::: code-group

```bash [pnpm]
pnpm add @midl/satoshi-kit
```

```bash [npm]
npm install @midl/satoshi-kit
```

```bash [yarn]
yarn add @midl/satoshi-kit
```

:::

## Usage

To use SatoshiKit, you need to wrap your app with `SatoshiKitProvider`. You can do this in your main entry file (e.g., `index.tsx` or `App.tsx`).

Import the required components and create midl config:

::: tip

Use `createMidlConfig` from `@midl/satoshi-kit` to create the midl config. This will automatically set up the connectors for you.

:::

::: code-group

```tsx{2,5,14-16} [App.tsx]
import { MidlProvider } from "@midl/react";
import { SatoshiKitProvider, ConnectButton } from "@midl/satoshi-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import "@midl/satoshi-kit/styles.css";
import { midlConfig, queryClient } from "./config";

export const App = ({ children }: { children: ReactNode }) => {
	const client = useMemo(() => queryClient, []);

	return (
	  <MidlProvider config={midlConfig}>
			<QueryClientProvider client={client}>
				<SatoshiKitProvider>
					<ConnectButton />
				</SatoshiKitProvider>
			</QueryClientProvider>
		</MidlProvider>
	);
};
```

```ts [config.ts]
import { type Config, regtest } from "@midl/core";
import { createMidlConfig } from "@midl/satoshi-kit";
import { QueryClient } from "@tanstack/react-query";

export const midlConfig = createMidlConfig({
  networks: [regtest],
  persist: true,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});
```

:::
