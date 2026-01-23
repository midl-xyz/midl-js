---
title: Runes Overview
order: 0
---

# Runes Overview

Bitcoin Runes lets developers create and move custom tokens on Bitcoin. In MIDL, any Rune deposit inside a transaction intention creates a Rune-to-ERC20 mapping automatically.

This guide explains:
- how MIDL represents Runes,
- and how to add a Rune to MIDL.

If you’re new to the MIDL transaction flow, review [How it works](../../how-it-works.md) first.

## Concepts

### Rune IDs
Runes are identified by a string in the format `blockHeight:txIndex` (for example, `840000:1`). Many APIs accept either the Rune name or the Rune ID.

### Rune-backed ERC20 assets
When a Rune is added to MIDL, it is mapped to an ERC20-style asset on the EVM side. The usual path is that the ERC20 contract is automatically created by MIDL for that Rune.

The mapping can be queried using the utilities and hooks in the executor/executor-react packages.

### Regular Rune mapping
The regular mapping is the default path: MIDL creates the ERC20 contract for the Rune when you add it.
