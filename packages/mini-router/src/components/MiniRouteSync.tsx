/**
 * @file MiniRouteSync.tsx
 * @author ickeep
 * @description 路由同步组件，用于同步 MiniRouter 和 React Router 的路由状态
 * @since 0.0.1
 */

import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMiniRouterPath } from '../hooks/useMiniRouter';

/**
 * MiniRouteSync 组件的属性接口
 * @interface MiniRouteSyncProps
 * @property {React.ReactNode} [children] - 子组件
 * @property {string} [basename] - 路由基础路径
 */
export const MiniRouteSync: React.FC<{ children?: React.ReactNode, basename?: string }> = ({ children, basename }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = useMiniRouterPath();
  const prevPathRef = useRef(path);

  /**
   * 同步路由状态
   * @summary 监听路径变化并同步到 React Router
   */
  useEffect(() => {
    if (!basename) {
      return;
    }
    if (prevPathRef.current !== path) {
      if (basename + pathname !== path) {
        navigate(path.replace(basename, ''));
      }
      prevPathRef.current = path;
    }
  }, [basename, navigate, path, pathname]);

  return <>{children}</>;
};
