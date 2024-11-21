# Function: isBadRequest()

> **isBadRequest**(`Response`?): `boolean`

判断是否为错误请求 (Bad Request)。

## Parameters

• **Response?**: `Partial`\<[`IHTTPResponse`](../interfaces/IHTTPResponse.md)\<`any`, `any`\>\>

HTTP 响应对象的部分属性。

## Returns

`boolean`

如果响应码为 `badRequest`，则返回 `true`，否则返回 `false`。

## Defined in

[packages/shared/src/api.tsx:18](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L18)
