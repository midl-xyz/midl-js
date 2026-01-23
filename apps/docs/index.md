---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "MIDL Javascript SDK"
  tagline: "Build Web3 apps on Bitcoin and MIDL with ease."
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Star on GitHub 
      link: https://github.com/midl-xyz/midl-js

features:
  - title: Simple API
    details: Easily interact with the Bitcoin blockchain and MIDL using a straightforward API.
  - title: TypeScript Support
    details: Built with TypeScript for type safety and better developer experience.
  - title: React Hooks
    details: Seamlessly integrate with React applications using custom hooks.
---

### Quick Example

```tsx
import { useBroadcastTransaction } from "@midl/react";

function App () {
  const { broadcastTransaction } = useBroadcastTransaction();

  const handleClick = async () => {
    broadcastTransaction({
      tx: "020000001...",
    });

    console.log("Transaction broadcasted:", result);
  };

  return <button onClick={handleClick}>Broadcast Transaction</button>;
}
```
