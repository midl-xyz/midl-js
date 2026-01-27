[![npm](https://img.shields.io/npm/v/@midl/core)](https://www.npmjs.com/package/@midl/core)
[![npm downloads](https://img.shields.io/npm/dm/@midl/core)](https://www.npmjs.com/package/@midl/core)
[![codecov](https://codecov.io/gh/midl-xyz/midl-js/graph/badge.svg?token=TVJ2PAA1ZA)](https://codecov.io/gh/midl-xyz/midl-js)
[![license](https://img.shields.io/github/license/midl-xyz/midl-js)](LICENSE)
[![issues](https://img.shields.io/github/issues/midl-xyz/midl-js)](https://github.com/midl-xyz/midl-js/issues)
[![prs](https://img.shields.io/github/issues-pr/midl-xyz/midl-js)](https://github.com/midl-xyz/midl-js/pulls)


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