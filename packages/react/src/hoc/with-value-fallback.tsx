import { observer, useExpressionScope } from '@formily/react';
import React, { useMemo } from 'react';

/**
 * 一个包装组件，用于在 value 未定义时回退使用 scope 的值 的 HOC
 * @param WrappedComponent 被包装的组件
 * @returns 包装后的组件
 */
export function withValueFallback<P extends { value?: unknown }>(WrappedComponent: React.ComponentType<P>) {
  const Component = (props: P & { withScopeValue?: boolean }) => {
    const { value, withScopeValue = true, ...rest } = props;
    const scope = useExpressionScope();
    const sValue = scope?.$value;
    const curValue = useMemo(() => {
      if (withScopeValue) {
        return value ?? sValue;
      }
      return value;
    }, [withScopeValue, sValue, value]);
    return <WrappedComponent {...(rest as P)} value={curValue} />;
  };

  return observer(Component);
}
