/**
 * @file useMiniRouter.ts
 * @author ickeep
 * @description 路由相关的自定义 Hooks
 * @since 0.0.1
 */

import { useContext } from 'react';

import { MiniRouterContext } from '../context/MiniRouterContext';

/**
 * 导航 Hook
 * @summary 提供编程式导航方法
 * @returns {Function} 导航函数
 * @throws {Error} 当在 MiniRouter 上下文外使用时抛出错误
 * @example
 * ```tsx
 * const navigate = useMiniNavigate();
 * navigate('/about');
 * ```
 */
export const useMiniNavigate = () => {
  const context = useContext(MiniRouterContext);

  if (!context) {
    throw new Error('useMiniNavigate 必须在 MiniRouter 组件内使用');
  }

  return context.navigate;
};

/**
 * 路径 Hook
 * @summary 获取当前路径
 * @returns {string} 当前路径
 * @throws {Error} 当在 MiniRouter 上下文外使用时抛出错误
 * @example
 * ```tsx
 * const currentPath = useMiniRouterPath();
 * console.log('当前路径:', currentPath);
 * ```
 */
export const useMiniRouterPath = () => {
  const context = useContext(MiniRouterContext);

  if (!context) {
    throw new Error('useMiniRouterPath 必须在 MiniRouter 组件内使用');
  }

  return context.currentPath;
};
