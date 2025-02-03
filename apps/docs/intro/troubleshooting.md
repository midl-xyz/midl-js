# Troubleshooting

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
