# Function: strToOptions()

> **strToOptions**\<`T`\>(`str`?, `splitter`?, `keys`?): [`IOptions`](../type-aliases/IOptions.md)\<`T`\>

将字符串转换为选项数组。

## Type Parameters

• **T** *extends* `string` = `"label"` \| `"value"`

选项对象的键类型，默认为 'label' | 'value'。

## Parameters

• **str?**: `string` = `''`

要转换的字符串。

• **splitter?**: `string` = `DF_SPLITTER`

分隔符，用于将字符串拆分为数组。

• **keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`T`\>

选项对象的键映射，如果未提供则使用默认键。

## Returns

[`IOptions`](../type-aliases/IOptions.md)\<`T`\>

- 转换后的选项数组。

## Example

```typescript
const str = '选项1,选项2,选项3';
const options = strToOptions(str);
console.log(options);
// 输出: [{ label: '选项1', value: '选项1' }, { label: '选项2', value: '选项2' }, { label: '选项3', value: '选项3' }]

const str = '选项1,选项2,选项3';
const splitter = ',';
const keys = { label: '标签', value: '值' };
const options = strToOptions(str, splitter, keys);
console.log(options);
// 输出: [{ 标签: '选项1', 值: '选项2' }, { 标签: '选项2', 值: '选项2' }, { 标签: '选项3', 值: '选项3' }]
```

## Defined in

[packages/shared/src/options.tsx:102](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L102)
