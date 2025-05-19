/**
 * @file PatternBrowserRouter.tsx
 * @author ickeep
 * @description 基于模式匹配的浏览器路由组件，用于与 React Router 集成
 * @since 0.0.1
 */

import React, { useMemo } from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';

import { useMiniRouterPath } from '../hooks/useMiniRouter';

import { MiniRouteSync } from './MiniRouteSync';

/**
 * PatternBrowserRouter 组件的属性接口
 * @interface PatternBrowserRouterProps
 * @extends {Omit<BrowserRouterProps, 'basename'>}
 * @property {string} [base] - 路由基础模式，用于正则匹配
 */
export function PatternBrowserRouter({ base, children }: Omit<BrowserRouterProps, 'basename'> & { base?: string }) {
  // 获取当前路径
  const path = useMiniRouterPath();

  /**
   * 计算基础路径
   * @summary 根据基础模式匹配当前路径
   */
  const baseName = useMemo(() => {
    if (base) {
      const pattern = new RegExp(`^${base}/[^/]+`);
      const match = path.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return '';
  }, [path, base]);

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
