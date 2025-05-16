/**
 * @file PrefixedBrowserRouter.tsx
 * @author ickeep
 * @description 带前缀的浏览器路由组件，用于与 React Router 集成
 * @since 0.0.1
 */

import React, { useMemo } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';

import { useMiniRouterPath } from '../hooks/useMiniRouter';

import { MiniRouteSync } from './MiniRouteSync';

/**
 * PrefixedBrowserRouter 组件的属性接口
 * @interface PrefixedBrowserRouterProps
 * @extends {Omit<BrowserRouterProps, 'basename'>}
 * @property {string} [prefix] - 路由前缀
 */
export function PrefixedBrowserRouter({ prefix, children }: Omit<BrowserRouterProps, 'basename'> & { prefix?: string }) {
  // 获取当前路径
  const path = useMiniRouterPath();

  /**
   * 计算基础路径
   * @summary 根据前缀和当前路径计算基础路径
   */
  const baseName = useMemo(() => {
    if (prefix && path.startsWith(prefix)) {
      const segments = path.split('/');
      return `${prefix}/${segments[2]}`;
    }
    return '';
  }, [path, prefix]);

  /**
   * 路由内容
   * @summary 使用计算出的基础路径创建路由内容
   */
  const routerContent = useMemo(() => (
    <BrowserRouter key={baseName} basename={baseName}>
      <MiniRouteSync basename={baseName} />
      {children}
    </BrowserRouter>
  ), [baseName, children]);

  return routerContent;
}
