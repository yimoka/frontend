import { observer, useExpressionScope } from '@formily/react';
import React, { useMemo } from 'react';

/**
 * 一个包装组件，用于在 children 未定义时回退使用 value 或 scope 的值
 * @param WrappedComponent 被包装的组件
 * @returns 包装后的组件
 */
export function withChildrenFallback<P extends { value?: unknown; children?: React.ReactNode }>(WrappedComponent: React.ComponentType<P>) {
  const Component = (props: P & { withScopeValue?: boolean; }) => {
    const { value, children, withScopeValue = true, ...rest } = props;
    const scope = useExpressionScope();
    const sValue = scope?.$value;

    const curChildren = useMemo(() => {
      if (typeof children !== 'undefined') {
        return children;
      }
      if (withScopeValue) {
        return value ?? sValue;
      }
      return value;
    }, [children, withScopeValue, value, sValue]);

    return <WrappedComponent {...(rest as P)} children={curChildren} />;
  };

  return observer(Component);
}
