# Function: optionsToObj()

> **optionsToObj**(`options`, `keys`?): `Record`\<`ObjKey`, `any`\>

将选项数组转换为键值对映射。

## Parameters

• **options**: [`IOptions`](../type-aliases/IOptions.md)\<`"label"` \| `"value"`\>

选项数组。

• **keys?**: [`IKeys`](../type-aliases/IKeys.md)\<`"label"` \| `"value"`\>

可选的键名配置对象。

## Returns

`Record`\<`ObjKey`, `any`\>

键值对映射。

## Examples

```ts
// 示例 1: 使用默认键名
const options = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' }
];
const map = optionsToMap(options);
console.log(map); // { 1: 'Option 1', 2: 'Option 2' }
```

```ts
// 示例 2: 使用自定义键名
const options = [
  { key: 'a', value: 'Alpha' },
  { key: 'b', value: 'Beta' }
];
const keys = { value: 'key', label: 'value' };
const map = optionsToMap(options, keys);
console.log(map); // { a: 'Alpha', b: 'Beta' }
```

```ts
// 示例 3: 输入为对象
const options = { a: 'Alpha', b: 'Beta' };
const map = optionsToMap(options);
console.log(map); // { a: 'Alpha', b: 'Beta' }
```

```ts
// 示例 4: 输入为非数组和非对象
const options = 'invalid';
const map = optionsToMap(options);
console.log(map); // {}
```

## Defined in

[packages/shared/src/options.tsx:294](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/options.tsx#L294)
