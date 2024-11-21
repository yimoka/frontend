# Function: isNetworkError()

> **isNetworkError**(`Response`?): `boolean`

判断响应是否为禁止访问状态

## Parameters

• **Response?**: `Partial`\<[`IHTTPResponse`](../interfaces/IHTTPResponse.md)\<`any`, `any`\>\>

HTTP响应的部分对象

## Returns

`boolean`

如果响应代码为禁止访问状态，则返回true

## Defined in

[packages/shared/src/api.tsx:42](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L42)
