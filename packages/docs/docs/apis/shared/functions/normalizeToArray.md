# Function: normalizeToArray()

> **normalizeToArray**(`value`): `any`[]

将输入值规范化为数组。

如果输入值已经是数组，则按原样返回该值。
如果输入值为空（null、undefined 或空字符串），则返回一个空数组。
否则，返回一个包含输入值的数组。

## Parameters

• **value**: `unknown`

要规范化为数组的值。

## Returns

`any`[]

包含输入值的数组，如果输入为空则返回空数组。

## Defined in

[packages/shared/src/arr.ts:14](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/arr.ts#L14)
