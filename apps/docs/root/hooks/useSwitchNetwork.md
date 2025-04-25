# useSwitchNetwork

Switches between different Bitcoin networks as configured

## Import

```ts
import { useSwitchNetwork } from '@midl-xyz/midl-js-react';
```

## Example

```tsx
import { mainnet, testnet } from '@midl-xyz/midl-js-core';

function MyComponent() {
    const {switchNetwork} = useSwitchNetwork();

    return (
        <button onClick={() => switchNetwork(mainnet)}>Switch to Testnet</button>
    );
}
```


