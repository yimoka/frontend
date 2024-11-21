# Type Alias: IMethod

> **IMethod**: `"GET"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"PURGE"` \| `"LINK"` \| `"UNLINK"` \| `string`

HTTP 请求方法类型。

该类型定义了常见的 HTTP 请求方法，包括：
- 'GET': 获取资源
- 'DELETE': 删除资源
- 'HEAD': 获取资源的头部信息
- 'OPTIONS': 获取资源的可用选项
- 'POST': 创建资源
- 'PUT': 更新资源
- 'PATCH': 部分更新资源
- 'PURGE': 清除缓存
- 'LINK': 建立资源之间的关系
- 'UNLINK': 解除资源之间的关系

还可以是任意字符串，以支持自定义方法。

## Defined in

[packages/shared/src/api.tsx:155](https://github.com/yimoka/frontend/blob/b3e03ee786f624575c621abcdf4ca6391a862316/packages/shared/src/api.tsx#L155)
