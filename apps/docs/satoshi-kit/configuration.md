---
order: 1
---

# Configuration

To configure SatoshiKit, you need to create a midl config using `createMidlConfig` from `@midl-xyz/satoshi-kit`. This config will automatically set up the connectors for you.


```ts
import { createMidlConfig } from "@midl-xyz/satoshi-kit";
import { regtest } from "@midl-xyz/midl-js-core";


export const midlConfig = createMidlConfig({
  networks: [regtest],
  persist: true,
}) as Config;
```

If you want to use SatoshiKit with a specific wallets, you can pass the `connectors` option to `createMidlConfig`. This will allow you to specify which wallets you want to use with SatoshiKit.

```ts
import { createMidlConfig } from "@midl-xyz/satoshi-kit";
import { regtest } from "@midl-xyz/midl-js-core";
import { xverseConnector } from "@midl-xyz/midl-js-connectors";

export const midlConfig = createMidlConfig({
  networks: [regtest],
  persist: true,
  connectors: [xverseConnector()],
}) as Config;
```

::: tip
You can also set custom metadata for the connectors by passing `metadata` option to the connector function. This metadata will be used to display the wallet in a specific category in the wallet list.

```ts
import { createMidlConfig } from "@midl-xyz/satoshi-kit";
import { regtest } from "@midl-xyz/midl-js-core";
import { xverseConnector } from "@midl-xyz/midl-js-connectors";

export const midlConfig = createMidlConfig({
  networks: [regtest],
  persist: true,
  connectors: [
    xverseConnector({
      metadata: {
        group: "popular",
      },
    }),
  ],
}) as Config;
```
:::


## SatoshiKitProvider

SatoshiKitProvider is a React context provider that allows you to use SatoshiKit in your application. It provides the necessary context for the components to work correctly.

You can specify the `purposes`, `authenticationAdapter`, and `config` props to customize the behavior of SatoshiKitProvider.

### Props

| Name                     | Type                                                                 | Description                                                                                   |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `purposes`               | `AddressPurpose[]`  (optional)                                                 | The purposes for which addresses will be generated. This is an array of `AddressPurpose` values. If not provided, defaults to `[AddressPurpose.Payment, AddressPurpose.Ordinals]`. |
| `authenticationAdapter`  | `AuthenticationAdapter` (optional)                     | An optional authentication adapter to handle user authentication. If not provided, SatoshiKit will use a default authentication flow. |
| `config`                 | `Config` (optional)                                                | The midl config object. If not provided, SatoshiKit will use the default config. |

For details on implementing the `authenticationAdapter`, see the [Authentication documentation](./authentication.md).


```tsx
import { SatoshiKitProvider } from "@midl-xyz/satoshi-kit";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import { midlConfig } from "./config";

export const App = () => {
    return (
        <SatoshiKitProvider config={midlConfig} purposes={[AddressPurpose.Payment]}>
            {/* Your app components */}
        </SatoshiKitProvider>
    );
};
```