# Type Alias: IAPIRequestConfig\<V\>

> **IAPIRequestConfig**\<`V`\>: `object`

API 请求的配置对象。

## Type Parameters

• **V** = `any`

请求参数和数据的类型。

## Index Signature

 \[`key`: `string`\]: `any`

## Type declaration

### data?

> `optional` **data**: `V`

### method?

> `optional` **method**: [`IMethod`](IMethod.md) \| `string`

### params?

> `optional` **params**: `V` \| `any`

### url?

> `optional` **url**: `string`

## Defined in

[packages/shared/src/api.tsx:89](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L89)
