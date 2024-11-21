# Interface: IHTTPResponse\<R, P\>

HTTP响应接口

## Type Parameters

• **R** = `any`

响应数据类型，默认为 `any`

• **P** = `any`

请求配置参数类型，默认为 `any`

## Indexable

 \[`key`: `string`\]: `any`

## Properties

### code

> **code**: `number`

响应状态码，可以是自定义的 `IHTTPCode` 或数字

#### Defined in

[packages/shared/src/api.tsx:68](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L68)

***

### config?

> `optional` **config**: [`IAPIRequestConfig`](../type-aliases/IAPIRequestConfig.md)\<`P`\>

请求配置，可选

#### Defined in

[packages/shared/src/api.tsx:71](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L71)

***

### data

> **data**: `R`

响应数据

#### Defined in

[packages/shared/src/api.tsx:70](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L70)

***

### headers?

> `optional` **headers**: `Record`\<`ObjKey`, `any`\>

响应头信息，可选

#### Defined in

[packages/shared/src/api.tsx:74](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L74)

***

### msg

> **msg**: `string`

响应信息

#### Defined in

[packages/shared/src/api.tsx:69](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L69)

***

### status?

> `optional` **status**: `number`

HTTP状态码，可选

#### Defined in

[packages/shared/src/api.tsx:72](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L72)

***

### statusText?

> `optional` **statusText**: `string`

HTTP状态文本，可选

#### Defined in

[packages/shared/src/api.tsx:73](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L73)
