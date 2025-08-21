# getFeeRate

> **getFeeRate**(`config`): `Promise`\<[`GetFeeRateResponse`](#getfeerateresponse)\>

Gets the recommended fee rate

## Import

```ts
import { getFeeRate } from "@midl/core";
```

## Example

```ts
const feeRate = await getFeeRate(config);
console.log(feeRate);
```

## Parameters

| Name   | Type                                                            | Description              |
| ------ | --------------------------------------------------------------- | ------------------------ |
| config | [`Config`](../configuration.md#creating-a-configuration-object) | The configuration object |

## Returns

`Promise`\<[`GetFeeRateResponse`](#getfeerateresponse)\>

The recommended fee rate object

### GetFeeRateResponse

| Name        | Type     | Description            |
| ----------- | -------- | ---------------------- |
| economyFee  | `number` | The economy fee rate   |
| fastestFee  | `number` | The fastest fee rate   |
| halfHourFee | `number` | The half hour fee rate |
| hourFee     | `number` | The hour fee rate      |
| minimumFee  | `number` | The minimum fee rate   |
