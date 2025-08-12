# weiToSatoshis

> **weiToSatoshis**(`value`): `number`

Converts a value in wei to its equivalent in satoshis.

1 satoshi equals 10,000,000,000 wei.

The conversion is performed as follows:
$$
\text{satoshis} = \left\lceil \frac{\text{wei}}{10^{10}} \right\rceil
$$

## Usage

```ts
import { weiToSatoshis } from '@midl/executor';

const sats = weiToSatoshis(10000000000n); // 1
```

## Parameters

| Name  | Type   | Description       |
| ----- | ------ | ----------------- |
| value | bigint | The value in wei. |

## Returns

`number` — The equivalent value in satoshis, rounded up.
