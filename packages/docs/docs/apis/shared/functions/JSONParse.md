# Function: JSONParse()

> **JSONParse**(`text`, `defaultValue`, `reviver`?): `any`

安全地解析 JSON 字符串，如果解析失败则返回默认值。

## Parameters

• **text**: `string`

要解析的 JSON 字符串。

• **defaultValue**: `object` = `{}`

解析失败时返回的默认值，默认为空对象。

• **reviver?**

可选的函数，用于转换结果。该函数会为对象的每个成员调用。

## Returns

`any`

解析后的对象，如果解析失败则返回默认值。

## Defined in

[packages/shared/src/json.ts:10](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/json.ts#L10)
