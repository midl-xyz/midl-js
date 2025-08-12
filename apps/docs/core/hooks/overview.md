---
title: Overview
order: -1
---

# Overview

MIDL.js provides React hooks for easy integration your React applications with the blockchain.
The hooks are designed to be simple to use and provide a seamless experience for developers.

Under the hood the hooks use the `@midl-xyz/midl-js-core` for blockchain interactions
and [`@tanstack/react-query`](https://tanstack.com/query/v5) to manage state and data fetching.

## Getting started

### Install the package

```bash
pnpm add @midl-xyz/midl-js-react
```

### Wrap your app with the `MidlProvider`

Wrap your app with the `MidlProvider` to provide the context to the hooks.

```tsx
import { MidlProvider } from "@midl-xyz/midl-js-react";
import midlConfig from "./midlConfig";

function App() {
  return (
    <MidlProvider config={midlConfig}>
      <MyComponent />
    </MidlProvider>
  );
}
```
