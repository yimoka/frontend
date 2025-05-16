/**
 * @file MiniRouterContext.tsx
 * @author ickeep
 * @description 路由上下文定义，提供路由状态和操作方法
 * @since 0.0.1
 */

import { createContext } from 'react';

/**
 * 路由上下文类型定义
 * @interface MiniRouterContextType
 * @property {string} currentPath - 当前路径
 * @property {(path: string) => void} navigate - 导航函数，用于改变当前路径
 * @property {(path: string) => boolean} hasMatch - 检查给定路径是否匹配当前路径
 * @property {(path: string) => void} registerRoute - 注册新路由
 * @property {(path: string) => void} unregisterRoute - 注销路由
 * @property {Set<string>} routes - 已注册的路由集合
 * @property {() => string | null} getBestMatchRoute - 获取当前路径下最匹配的路由
 */
export interface MiniRouterContextType {
  /** 当前路径 */
  currentPath: string;
  /** 导航函数，用于改变当前路径 */
  navigate: (path: string) => void;
  /** 检查给定路径是否匹配当前路径 */
  hasMatch: (path: string) => boolean;
  /** 注册新路由 */
  registerRoute: (path: string) => void;
  /** 注销路由 */
  unregisterRoute: (path: string) => void;
  /** 已注册的路由集合 */
  routes: Set<string>;
  /** 获取当前路径下最匹配的路由 */
  getBestMatchRoute: () => string | null;
}

/**
 * 路由上下文
 * @summary 创建路由上下文，用于在组件树中共享路由状态和操作方法
 */
export const MiniRouterContext = createContext<MiniRouterContextType | null>(null);
