# Function: JSONStringify()

> **JSONStringify**(`value`, `defaultValue`, `replacer`?, `space`?): `string`

将给定的值转换为 JSON 字符串。

## Parameters

• **value**: `unknown`

要转换的值。

• **defaultValue**: `string` = `''`

如果转换失败，返回的默认值，默认为空字符串。

• **replacer?**: `null` \| (`string` \| `number`)[]

可选的替换函数或数组，用于选择或修改要包含在 JSON 字符串中的属性。

• **space?**: `string` \| `number`

可选的用于增加返回值 JSON 字符串的可读性的空白字符。

## Returns

`string`

转换后的 JSON 字符串，如果转换失败则返回默认值。

## Defined in

[packages/shared/src/json.ts:30](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/json.ts#L30)
