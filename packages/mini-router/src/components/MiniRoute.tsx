/**
 * @file MiniRoute.tsx
 * @author ickeep
 * @description 路由匹配组件，根据路径条件渲染内容
 * @since 0.0.1
 */

import React, { useContext, useEffect } from 'react';

import { MiniRouterContext } from '../context/MiniRouterContext';

/**
 * MiniRoute 组件的属性接口
 * @interface MiniRouteProps
 * @property {string} path - 路由路径
 * @property {React.ReactNode} component - 要渲染的组件
 */
interface MiniRouteProps {
  path: string;
  component: React.ReactNode;
}

/**
 * 路由匹配组件
 * @component
 * @summary 根据路径条件渲染内容，支持精确匹配和通配符匹配
 * @param {MiniRouteProps} props - 组件属性
 * @returns {JSX.Element | null} 匹配时渲染组件，否则返回 null
 * @example
 * ```tsx
 * <MiniRoute path="/" component={<Home />} />
 * <MiniRoute path="/about" component={<About />} />
 * <MiniRoute path="/user/*" component={<UserLayout />} />
 * ```
 */
export const MiniRoute: React.FC<MiniRouteProps> = React.memo(({ path, component }) => {
  const context = useContext(MiniRouterContext);

  if (!context) {
    throw new Error('MiniRoute 必须在 MiniRouter 组件内使用');
  }

  const { hasMatch, registerRoute, unregisterRoute, getBestMatchRoute } = context;

  // 注册和注销路由
  useEffect(() => {
    registerRoute(path);
    return () => unregisterRoute(path);
  }, [path, registerRoute, unregisterRoute]);

  // 获取最佳匹配路由
  const bestMatch = getBestMatchRoute();
  if (bestMatch !== path) return null;

  // 根据匹配结果渲染组件
  return hasMatch(path) ? <>{component}</> : null;
});
