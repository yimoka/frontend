# Function: isBlank()

> **isBlank**(`value`): value is undefined \| null \| ""

判断值是否为空 ('' | null | undefined | 空对象 | 空数组)

## Parameters

• **value**: `unknown`

要检查的值

## Returns

value is undefined \| null \| ""

如果值为 null、undefined 或空字符串/对象/数据，则返回 true；否则返回 false

## Example

```typescript
isBlank(null); // true
isBlank(undefined); // true
isBlank(''); // true
isBlank('hello'); // false
isBlank(0); // false
isBlank(false); // false
```

## Defined in

[packages/shared/src/val.ts:18](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/val.ts#L18)
