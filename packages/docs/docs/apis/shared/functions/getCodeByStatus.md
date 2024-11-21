# Function: getCodeByStatus()

> **getCodeByStatus**(`status`): `number`

根据状态码返回对应的 HTTP 代码。

## Parameters

• **status**: `number`

HTTP 状态码。

## Returns

`number`

如果状态码在 200 到 299 之间，返回 IHTTPCode.success，否则返回原始状态码。

## Defined in

[packages/shared/src/api.tsx:50](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L50)
