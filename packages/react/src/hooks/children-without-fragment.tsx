import React, { isValidElement, ReactNode, useMemo } from 'react';

export const useChildrenWithoutFragment = (children: ReactNode) => useMemo(() => withoutFragment(children), [children]);

const withoutFragment = (children: ReactNode): ReactNode => {
  if (!children) return null;
  // 如果是数组，递归处理每个子元素
  if (Array.isArray(children)) {
    const arr = children.filter(item => item !== null).map(child => withoutFragment(child));
    if (arr.length === 1) {
      return arr[0];
    }
    return arr;
  }
  // 如果是 Fragment，递归处理每个子元素
  if (isValidElement(children) && children.type === React.Fragment) {
    const newChildren = withoutFragment(children.props.children);
    if (Array.isArray(newChildren)) {
      return withoutFragment(newChildren);
    }
    return newChildren;
  }
  // 否则直接返回原始元素
  return children;
};

