/**
 * @file MiniRouter.tsx
 * @author ickeep
 * @description 轻量级路由容器组件，提供路由上下文和导航功能
 * @since 0.0.1
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { MiniRouterContext } from '../context/MiniRouterContext';

/**
 * MiniRouter 组件的属性接口
 * @interface MiniRouterProps
 * @property {React.ReactNode} children - 子组件
 * @property {string} [basename] - 路由基础路径
 */
interface MiniRouterProps {
  children: React.ReactNode;
  basename?: string;
}

/**
 * 轻量级路由容器组件
 * @component
 * @summary 提供路由上下文和导航功能，管理路由状态和导航操作
 * @param {MiniRouterProps} props - 组件属性
 * @returns {JSX.Element} 路由容器组件
 * @example
 * ```tsx
 * <MiniRouter basename="/app">
 *   <MiniRoute path="/" component={<Home />} />
 *   <MiniRoute path="/about" component={<About />} />
 * </MiniRouter>
 * ```
 */
export const MiniRouter: React.FC<MiniRouterProps> = ({ children, basename }) => {
  // 当前路径状态
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  // 已注册路由集合
  const [routes, setRoutes] = useState<Set<string>>(new Set());

  /**
   * 导航函数
   * @param {string} path - 目标路径
   */
  const navigate = useCallback((path: string) => {
    const fullPath = basename ? `${basename}${path}` : path;
    window.history.pushState(null, '', fullPath);
    setCurrentPath(fullPath);
  }, [basename]);

  /**
   * 检查路径是否匹配
   * @param {string} path - 待检查的路径
   * @returns {boolean} 是否匹配
   */
  const hasMatch = useCallback((path: string): boolean => {
    if (path === '*') return true;
    if (path.endsWith('*')) {
      const basePath = path.slice(0, -2);
      return currentPath.startsWith(basePath);
    }
    return currentPath === path;
  }, [currentPath]);

  /**
   * 获取最佳匹配路由
   * @returns {string | null} 最佳匹配的路由路径
   */
  const getBestMatchRoute = useCallback((): string | null => {
    let best: string | null = null;
    let bestLength = -1;
    routes.forEach((routePath) => {
      if (hasMatch(routePath)) {
        if (routePath === '*') {
          if (best === null) {
            best = routePath;
            bestLength = 0;
          }
        } else {
          const depth = routePath === '*' ? 0 : routePath.replace(/\*$/, '').length;
          if (depth > bestLength) {
            best = routePath;
            bestLength = depth;
          }
        }
      }
    });
    return best;
  }, [routes, hasMatch]);

  /**
   * 注册路由
   * @param {string} path - 路由路径
   */
  const registerRoute = useCallback((path: string) => {
    setRoutes((prev) => {
      if (prev.has(path)) return prev;
      return new Set([...prev, path]);
    });
  }, []);

  /**
   * 注销路由
   * @param {string} path - 路由路径
   */
  const unregisterRoute = useCallback((path: string) => {
    setRoutes((prev) => {
      if (!prev.has(path)) return prev;
      const newRoutes = new Set(prev);
      newRoutes.delete(path);
      return newRoutes;
    });
  }, []);

  // 监听浏览器历史记录变化
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 路由上下文值
  const contextValue = useMemo(() => ({
    currentPath,
    navigate,
    hasMatch,
    registerRoute,
    unregisterRoute,
    routes,
    getBestMatchRoute,
  }), [currentPath, navigate, hasMatch, registerRoute, unregisterRoute, routes, getBestMatchRoute]);

  return (
    <MiniRouterContext.Provider value={contextValue}>
      {children}
    </MiniRouterContext.Provider>
  );
};
