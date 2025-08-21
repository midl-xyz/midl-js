---
order: 6
---
# Troubleshooting

## Module not found: Can't resolve '../../../../../../styled-system/css'

This error typically occurs when the `SatoshiKit` conflicts with the Next.JS turbopack feature. To resolve this, you can either disable turbopack or transpile the `@midl/satoshi-kit` package.

To disable turbopack, you can add the following to your `next.config.js`:

```js
module.exports = {
  experimental: {
    turbo: false,
  },
};
```

It could also be configured in the `start` script in your `package.json`:

```json 
{
  "scripts": {
    "start": "next start --turbo" // [!code --]
    "start": "next start" // [!code ++]
  }
}
```

To transpile the `@midl/satoshi-kit` package, you can add the following to your `next.config.js`:

```js
module.exports = {
  transpilePackages: ["@midl/satoshi-kit"],
};
```

## Buffer is not defined

::: warning

This project uses `Buffer` and `BigInt` which are not available in all the environments. You may need to polyfill them. e.g. for Vite bundler, you can polyfill them by adding the following in your `index.html`:

:::

```html
<script type="module">
  import { Buffer } from "buffer";
  window.Buffer = Buffer;
  window.global = window;
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
</script>
```
