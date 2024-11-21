# Function: objToOptions()

> **objToOptions**\<`T`\>(`obj`?, `keys`?, `childrenKey`?): [`IOptions`](../type-aliases/IOptions.md)\<`T`\>

将对象转换为选项数组。

## Type Parameters

• **T** *extends* `string` = `"label"` \| `"value"`

字符串类型，默认为 'label' | 'value'。

## Parameters

• **obj?**: `IAnyObject` = `{}`

要转换的对象，默认为空对象。

• **keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`T`\>

可选的键值对，用于指定选项的键。

• **childrenKey?**: `string`

可选的子项键。

## Returns

[`IOptions`](../type-aliases/IOptions.md)\<`T`\>

转换后的选项数组。

## Examples

```ts
const obj = { a: '选项A', b: '选项B' };
const options = objToOptions(obj);
// 返回: [{ value: 'a', label: '选项A' }, { value: 'b', label: '选项B' }]
```

```ts
const obj = { a: { label: '选项A', extra: '额外信息' }, b: { label: '选项B' } };
const keys = { label: 'label', value: 'value' };
const options = objToOptions(obj, keys);
// 返回: [{ value: 'a', label: '选项A', extra: '额外信息' }, { value: 'b', label: '选项B' }]
```

## Defined in

[packages/shared/src/options.tsx:132](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L132)
