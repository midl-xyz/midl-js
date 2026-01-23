---
title: E2E Testing (Playwright)
order: 0
---

# E2E Testing (Playwright)

This guide shows a minimal setup for running end-to-end tests with wallet extensions using `@midl/playwright`.

## Install

```bash
pnpm add -D @playwright/test @midl/playwright
```

Install Playwright browsers (if you haven’t already):

```bash
pnpm playwright install
```

## Basic test

`@midl/playwright` ships a test fixture that launches Chromium with a wallet extension and exposes a `wallet` helper.

```ts
import { createTest } from "@midl/playwright";

const { test, expect } = createTest({
  mnemonic: "test test test test test test test test test test test junk",
  extension: "leather",
});

test("connects wallet", async ({ page, wallet }) => {
  await page.goto("http://localhost:3000");
  await wallet.connect();
  // add your assertions here
});
```

## Notes

- Tests run in a **headed** Chromium context (extensions require it).
- If you want to persist extension state across runs, pass `shouldPersist: true`.
