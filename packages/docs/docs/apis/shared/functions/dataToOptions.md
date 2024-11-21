# Function: dataToOptions()

> **dataToOptions**\<`T`\>(`data`?, `conf`?): [`IOptions`](../type-aliases/IOptions.md)\<`T`\>

将数据转换为选项数组。

## Type Parameters

• **T** *extends* `string` = `"label"` \| `"value"`

用于键的泛型，默认为 'label' | 'value'。

## Parameters

• **data?**: `any`

要转换的数据，可以是数组、字符串或对象。

• **conf?**

选项配置对象。

• **conf.childrenKey?**: `string`

子项键名，如果需要递归处理时显性传入。

• **conf.keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`T`\>

键的映射配置。

• **conf.splitter?**: `string`

分隔符，默认为 DF_SPLITTER。

## Returns

[`IOptions`](../type-aliases/IOptions.md)\<`T`\>

转换后的选项数组。

## Examples

```ts
// 示例 1: 数组数据
const dataArray = [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }];
const options1 = dataToOptions(dataArray);
console.log(options1);
// 输出: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }]
```

```ts
// 示例 2: 字符串数据
const dataString = '选项1,选项2,选项3';
const options2 = dataToOptions(dataString, { splitter: ',' });
console.log(options2);
// 输出: [{ label: '选项1', value: '选项1' }, { label: '选项2', value: '选项2' }, { label: '选项3', value: '选项3' }]
```

```ts
// 示例 3: 对象数据
const dataObject = { key1: '选项1', key2: '选项2' };
const options3 = dataToOptions(dataObject);
console.log(options3);
// 输出: [{ label: 'key1', value: '选项1' }, { label: 'key2', value: '选项2' }]
```

## Defined in

[packages/shared/src/options.tsx:174](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L174)
