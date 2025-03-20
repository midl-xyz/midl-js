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
