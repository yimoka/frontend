# Function: isValueInOptions()

> **isValueInOptions**(`value`, `options`, `conf`?): `boolean`

检查给定的值是否在选项列表中。

## Parameters

• **value**: `any`

要检查的值，可以是单个值或值的数组。

• **options**: [`IOptions`](../type-aliases/IOptions.md)\<`"value"`\>

选项列表，包含多个选项对象。

• **conf?**

可选的配置对象，包含键名和子选项键名。

• **conf.childrenKey?**: `string`

子选项的键名，如果选项对象包含子选项。

• **conf.keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`"value"`\>

包含键名的对象。

## Returns

`boolean`

如果值在选项列表中，则返回 `true`，否则返回 `false`。

## Examples

```ts
// 示例 1: 单个值在选项列表中
const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
const result = isValueInOptions(2, options);
console.log(result); // 输出: true
```

```ts
// 示例 2: 值不在选项列表中
const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
const result = isValueInOptions(4, options);
console.log(result); // 输出: false
```

```ts
// 示例 3: 带有子选项的情况
const options = [
  { value: 1, children: [{ value: 4 }, { value: 5 }] },
  { value: 2 },
  { value: 3 }
];
const result = isValueInOptions(4, options, { childrenKey: 'children' });
console.log(result); // 输出: true
```

```ts
// 示例 4: 值为数组的情况
const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
const result = isValueInOptions([1, 2], options);
console.log(result); // 输出: true
```

```ts
// 示例 5: 值为数组的情况，其中一个值不在选项列表中
const options = [{ value: 1 }, { value: 2 }, { value: 3 }];
const result = isValueInOptions([1, 4], options);
console.log(result); // 输出: false
```

## Defined in

[packages/shared/src/options.tsx:237](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L237)
