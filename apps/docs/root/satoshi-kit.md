---
title: SatoshiKit
order: 3
---

# SatoshiKit

SatoshiKit provides a simple way to connect your apps with Bitcoin wallets.

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
pnpm add @midl-xyz/satoshi-kit
```

```bash [npm]
npm install @midl-xyz/satoshi-kit
```

```bash [yarn]
yarn add @midl-xyz/satoshi-kit
```

:::

## Usage

To use SatoshiKit, you need to wrap your app with `SatoshiKitProvider`. You can do this in your main entry file (e.g., `index.tsx` or `App.tsx`).

Import the required components and create midl config:

::: tip

Use `createMidlConfig` from `@midl-xyz/satoshi-kit` to create the midl config. This will automatically set up the connectors for you.

:::

::: code-group

```tsx{2,5,6} [App.tsx]
import { MidlProvider } from "@midl-xyz/midl-js-react";
import { SatoshiKitProvider } from "@midl-xyz/satoshi-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import "@midl-xyz/satoshi-kit/styles.css";
import { midlConfig, queryClient } from "./config";

export const App = ({ children }: { children: ReactNode }) => {
	const client = useMemo(() => queryClient, []);

	return (
		<MidlProvider config={midlConfig}>
			<SatoshiKitProvider>
				<QueryClientProvider client={client}>{children}</QueryClientProvider>
			</SatoshiKitProvider>
		</MidlProvider>
	);
};
```

```ts [config.ts]
import { type Config, regtest } from "@midl-xyz/midl-js-core";
import { createMidlConfig } from "@midl-xyz/satoshi-kit";
import { QueryClient } from "@tanstack/react-query";

export const midlConfig = createMidlConfig({
  networks: [regtest],
  persist: true,
}) as Config;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});
```

:::

### Add ConnectButton

You can add the `ConnectButton` component to your app to allow users to connect their wallets. The `ConnectButton` will automatically detect the available connectors and display them.

```tsx
import { ConnectButton } from "@midl-xyz/satoshi-kit";

export const Page = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};
```

## Customization

You can customize the `ConnectButton` appearance by passing children to it.

```tsx
import { ConnectButton, AccountButton } from "@midl-xyz/satoshi-kit";
import { Button } from "/path/to/your/button/component";

export const Page = () => {
  return (
    <div>
      <ConnectButton>
        {({
          openConnectDialog,
          openAccountDialog,
          isConnected,
          isConnecting,
        }) => {
          return (
            <Button
              onClick={isConnected ? openAccountDialog : openConnectDialog}
            >
              {isConnected ? (
                <AccountButton
                  hideAvatar
                  hideBalance
                  hideAddress
                  onClick={openAccountDialog}
                />
              ) : (
                "Connect"
              )}
            </Button>
          );
        }}
      </ConnectButton>
    </div>
  );
};
```

## ConnectButton Props

| Name          | Type      | Description                                 |
| ------------- | --------- | ------------------------------------------- |
| `hideAvatar`  | `boolean` | Hide the avatar icon.                       |
| `hideBalance` | `boolean` | Hide the balance.                           |
| `hideAddress` | `boolean` | Hide the address.                           |
| `children`    |           | The children function to render the button. |
