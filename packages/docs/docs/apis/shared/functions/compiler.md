# Function: compiler()

> **compiler**(`expression`, `scope`?): `any`

编译器函数，用于解析和计算表达式。

## Parameters

• **expression**: `string`

要解析的表达式字符串。

• **scope?** = `{}`

可选的作用域对象，用于在表达式中查找变量。

## Returns

`any`

- 返回表达式的计算结果。如果表达式为空，则返回 undefined。

## Remarks

小程序不支持 new Function eval, 所以需要自己实现一个 compiler
当前只支持取值和简单的表达式计算，不支持函数及函数调用
支持基础的计算 + - * / %
支持基础的比较/逻辑
支持使用()改变优先级
支持简单的三元表达式

## Examples

```typescript
const result = compiler('1 + 2');
console.log(result); // 输出: 3
```

```typescript
const scope = { a: 1, b: 2 };
const result = compiler('a + b', scope);
console.log(result); // 输出: 3
```

## Defined in

[packages/shared/src/compiler.ts:30](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/compiler.ts#L30)
