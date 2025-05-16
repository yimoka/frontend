# @yimoka/mini-router

一个轻量级的 React 路由解决方案，提供简单而强大的路由功能。

## 特性

- 🚀 轻量级实现
- 🔄 支持路由同步
- 🎯 精确的路由匹配
- 🔗 支持编程式和声明式导航
- 🛠 提供 React Hooks API
- 📦 支持 TypeScript

## 安装

```bash
npm install @yimoka/mini-router
# 或
yarn add @yimoka/mini-router
# 或
pnpm add @yimoka/mini-router
```

## 使用方法

### 基本使用

```tsx
import { MiniRouter, MiniRoute, MiniLink } from '@yimoka/mini-router';

function App() {
  return (
    <MiniRouter>
      <nav>
        <MiniLink to="/">首页</MiniLink>
        <MiniLink to="/about">关于</MiniLink>
      </nav>

      <MiniRoute path="/" component={<Home />} />
      <MiniRoute path="/about" component={<About />} />
    </MiniRouter>
  );
}
```

### 与 React Router 集成

```tsx
import { PrefixedBrowserRouter } from '@yimoka/mini-router';

function App() {
  return (
    <PrefixedBrowserRouter prefix="/app">
      {/* 你的应用内容 */}
    </PrefixedBrowserRouter>
  );
}
```

## API

### 组件

#### MiniRouter

路由容器组件，提供路由上下文。

```tsx
<MiniRouter basename?: string>
  {children}
</MiniRouter>
```

#### MiniRoute

路由匹配组件，根据路径条件渲染内容。

```tsx
<MiniRoute path: string component: React.ReactNode />
```

#### MiniLink

导航链接组件，提供声明式导航。

```tsx
<MiniLink to: string className?: string>
  {children}
</MiniLink>
```

#### PrefixedBrowserRouter

与 React Router 集成的路由组件。

```tsx
<PrefixedBrowserRouter prefix?: string>
  {children}
</PrefixedBrowserRouter>
```

### Hooks

#### useMiniNavigate

提供编程式导航方法。

```tsx
const navigate = useMiniNavigate();
navigate('/path');
```

#### useMiniRouterPath

获取当前路径。

```tsx
const currentPath = useMiniRouterPath();
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 许可证

MIT
