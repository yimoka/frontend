# Interface: IPageData\<T\>

表示分页数据的接口。

## Type Parameters

• **T** *extends* `object` = `Record`\<`ObjKey`, `any`\>

页中数据项的类型。默认为键为 `ObjKey` 类型，值为任意类型的记录。

## Indexable

 \[`key`: `string`\]: `any`

## Properties

### data

> **data**: `T`[]

当前页的数据项数组。

#### Defined in

[packages/shared/src/api.tsx:115](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L115)

***

### page

> **page**: `number`

当前页码。

#### Defined in

[packages/shared/src/api.tsx:111](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L111)

***

### pageSize

> **pageSize**: `number`

每页的项目数。

#### Defined in

[packages/shared/src/api.tsx:112](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L112)

***

### total

> **total**: `number`

项目总数。

#### Defined in

[packages/shared/src/api.tsx:113](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L113)

***

### totalPages

> **totalPages**: `number`

总页数。

#### Defined in

[packages/shared/src/api.tsx:114](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L114)
