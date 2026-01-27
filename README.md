<br/>
<div align="center">
  <a href="https://js.midl.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./.github/logo-dark.svg">
      <img alt="midl logo" src="./.github/logo.svg" width="auto" height="60">
    </picture>
  </a>
</div>

<div align="center">
 Build Web3 dApps on Bitcoin and MIDL with TypeScript and React.
</div>

---

### Features

- **Connect to any Bitcoin network** (mainnet, testnet, regtest, etc.)
- **Publish transactions** to the Bitcoin network
- **Sign PSBTs**
- **Sign messages** using BIP322 and ECDSA
- **Transfer Runes**
- **Etch runes** on the blockchain

### Documentation

For detailed documentation, please visit our [documentation site](https://js.midl.xyz).

### Development

To contribute to the MIDL JS library, you can clone the repository and run the following commands:

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build:packages

# Run tests
pnpm test:packages
```

#### Documentation

To contribute to the documentation, you can edit the Markdown files in the `apps/docs` directory. The documentation is built using [VitePress](https://vitepress.dev/).

Run the following command to start the documentation server:

```bash
pnpm docs:dev
```