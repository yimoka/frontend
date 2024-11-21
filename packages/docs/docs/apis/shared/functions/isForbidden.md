# Function: isForbidden()

> **isForbidden**(`Response`?): `boolean`

检查响应是否为禁止访问状态。

## Parameters

• **Response?**: `Partial`\<[`IHTTPResponse`](../interfaces/IHTTPResponse.md)\<`any`, `any`\>\>

部分 HTTP 响应对象。

## Returns

`boolean`

如果响应代码为禁止访问状态，则返回 true。

## Defined in

[packages/shared/src/api.tsx:34](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L34)
