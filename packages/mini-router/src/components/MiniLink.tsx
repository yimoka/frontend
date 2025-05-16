/**
 * @file MiniLink.tsx
 * @author ickeep
 * @description 导航链接组件，提供声明式导航功能
 * @since 0.0.1
 */

import React, { useContext } from 'react';

import { MiniRouterContext } from '../context/MiniRouterContext';

/**
 * MiniLink 组件的属性接口
 * @interface MiniLinkProps
 * @property {string} to - 目标路径
 * @property {React.ReactNode} children - 链接内容
 * @property {string} [className] - 自定义类名
 */
interface MiniLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 导航链接组件
 * @component
 * @summary 提供声明式导航功能，用于创建可点击的导航链接
 * @param {MiniLinkProps} props - 组件属性
 * @returns {JSX.Element} 导航链接元素
 * @example
 * ```tsx
 * <MiniLink to="/" className="nav-link">首页</MiniLink>
 * <MiniLink to="/about">关于</MiniLink>
 * ```
 */
export const MiniLink: React.FC<MiniLinkProps> = React.memo(({ to, children, className }) => {
  const context = useContext(MiniRouterContext);

  if (!context) {
    throw new Error('MiniLink 必须在 MiniRouter 组件内使用');
  }

  /**
   * 处理点击事件
   * @param {React.MouseEvent} e - 鼠标事件对象
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    context.navigate(to);
  };

  return (
    <a className={className} href={to} onClick={handleClick}>
      {children}
    </a>
  );
});
