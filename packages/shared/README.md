# shared 包

## 简介

这个包包含项目中共享的工具函数和通用代码，旨在提供可复用的功能模块，减少代码重复，提高开发效率。

## 特性

- 提供纯函数工具集，避免副作用
- 严格的TypeScript类型定义
- 高度可测试性设计
- 完善的文档和注释
- 轻量级设计，最小化外部依赖

## 功能模块

### 日期和时间处理 (date.ts)
- `toDayjs`: 将各种类型的日期转换为Dayjs对象
- `getDateValue`: 根据指定的选项获取日期值
- `getPresetsDate`: 获取预设日期
- `getPresetsDateRange`: 获取预设日期范围
- 类型定义: `IDateType`, `IDate`, `IDateOptions`, `IPresetsDate`, `IPresetsDateRange`

### 数组处理 (arr.ts)
- `normalizeToArray`: 将输入值规范化为数组

### 对象处理 (obj.ts)
- `mergeWithArrayOverride`: 合并两个对象，当遇到数组时用源数组覆盖目标数组

### API相关 (api.tsx)
- `isSuccess`: 判断响应是否成功
- `isBadRequest`: 判断是否为错误请求
- `isUnauthorized`: 检查响应是否为未授权状态
- `isForbidden`: 检查响应是否为禁止访问状态
- `isNetworkError`: 判断响应是否为网络错误
- `getCodeByStatus`: 根据状态码返回对应的HTTP代码
- 类型定义: `IHTTPResponse`, `IAPIRequestConfig`, `IPageData`, `IHTTPCode`, `IMethod`

### 值校验 (val.ts)
- 包含空值、非空值、真假值等校验函数

### 数字处理 (num.tsx)
- 包含数字格式化、计算和转换等功能

### 字符串处理 (str.tsx)
- 包含字符串操作和格式化函数

### JSON处理 (json.ts)
- 包含JSON解析、序列化和操作函数

### Promise处理 (promise.ts)
- 包含Promise相关的工具函数

### 过滤器 (filter.ts)
- 包含数据过滤和筛选相关功能

### 选项处理 (options.tsx)
- 包含表单选项、下拉菜单等UI组件选项处理函数

### 排序 (sorter.ts)
- 包含数据排序相关函数

### 编译器相关 (compiler.ts)
- 包含代码编译和转换相关功能

### 类型定义 (type.ts)
- 包含共享的TypeScript类型定义

### 异常处理 (try.tsx)
- 包含错误捕获和处理的工具函数

## 安装

```bash
# 在项目根目录执行
pnpm install
```

## 使用方法

```typescript
// 从shared包中导入所需工具
import { 工具函数 } from '@项目名/shared';

// 使用工具函数
const 结果 = 工具函数(参数);
```

## 开发规范

### 代码风格

- 所有代码必须使用TypeScript编写
- 函数应保持纯函数特性，避免副作用
- 遵循单一职责原则
- 导出接口而非具体实现
- 文件名使用kebab-case命名规则

### 注释规范

- 所有代码文件必须包含中文注释，遵循Typedoc规范
- 文件头部必须包含三引号块注释，说明模块功能、作者和修改记录
- 所有函数必须包含完整的参数说明、返回值类型和异常场景说明
- 复杂代码逻辑必须添加行内注释说明

### 测试要求

- 使用Vitest 3.0+框架进行单元测试
- 测试文件必须使用.test.ts后缀
- 测试文件存放在源文件的__tests__目录下
- 测试覆盖率必须达到95%以上
- 测试应包含正常路径、异常路径和边缘情况

## 贡献指南

1. 确保理解并遵循项目的代码规范
2. 提交前运行完整的测试套件
3. 为新增功能提供完整的文档和测试
4. 保持向后兼容性，避免破坏性更新

## 架构约束

- 尽可能避免外部依赖，保持包的轻量
- 充分利用TypeScript的严格模式特性
- 工具函数应该设计为易于测试
- 使用TypeScript的高级类型特性增强类型安全
