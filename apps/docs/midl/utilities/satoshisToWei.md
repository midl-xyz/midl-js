# satoshisToWei

> **satoshisToWei**(`value`): `bigint`

Converts a value in satoshis to its equivalent in wei.

1 satoshi equals 10,000,000,000 wei.

The conversion is performed as follows:
$$
\text{wei} = \text{satoshis} \times 10^{10}
$$

## Usage

```ts
import { satoshisToWei } from '@midl/executor';

const wei = satoshisToWei(1000);
```

## Parameters

| Name  | Type   | Description                       |
| ----- | ------ | --------------------------------- |
| value | number | The number of satoshis to convert |

## Returns

`bigint` — The equivalent value in wei.


