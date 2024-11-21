# Function: addWithLimit()

> **addWithLimit**(`num`, `options`): `number`

在指定限制内将步长值添加到给定数字。

## Parameters

• **num**: `number`

要增加的初始数字。

• **options** = `{}`

包含以下属性的对象：

• **options.initial**: `undefined` \| `number` = `0`

如果数字超出限制，则返回的初始值。默认值为0。

• **options.max**: `undefined` \| `number` = `1000`

数字的最大限制。默认值为1000。

• **options.min**: `undefined` \| `number` = `0`

数字的最小限制。默认值为0。

• **options.step**: `undefined` \| `number` = `1`

要添加到初始数字的值。默认值为1。

## Returns

`number`

增加后的数字或如果超出限制则返回初始值。

## Defined in

[packages/shared/src/num.tsx:12](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/num.tsx#L12)
