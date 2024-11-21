# Function: arrToOptions()

> **arrToOptions**\<`T`\>(`options`?, `keys`?, `childrenKey`?): [`IOptions`](../type-aliases/IOptions.md)\<`T`\>

将数组转换为选项对象数组。

## Type Parameters

• **T** *extends* `string` = `"label"` \| `"value"`

键的类型，默认为 'label' | 'value'。

## Parameters

• **options?**: [`IOptions`](../type-aliases/IOptions.md)\<`T`\> = `[]`

要转换的选项数组。

• **keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`T`\>

键的映射对象。

• **childrenKey?**: `string`

子选项的键。

## Returns

[`IOptions`](../type-aliases/IOptions.md)\<`T`\>

转换后的选项对象数组。

## Example

```ts
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2', children: [{ label: 'Sub Option 1', value: '1-1' }] }
];
const keys = { label: 'name', value: 'id', children: 'subOptions' };
const result = arrToOptions(options, keys, 'children');
// result: [
//   { name: 'Option 1', id: '1' },
//   { name: 'Option 2', id: '2', subOptions: [{ name: 'Sub Option 1', id: '1-1' }] }
// ]
```

## Defined in

[packages/shared/src/options.tsx:34](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L34)
