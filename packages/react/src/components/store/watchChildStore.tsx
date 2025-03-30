import { IAny } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { ReactNode, isValidElement, cloneElement, useCallback, ReactElement } from 'react';
import { isFragment } from 'react-is';


/**
 * 用于获取子组件的 store
 * 在低代码中父子层必须是 'x-decorator' 和 'x-component'
 * 跨层因为 RecursionField 的缘故无法使用
 */
export const WatchChildStore = ({ children, onStore }: WatchChildStoreProps) => {
  const handleStore = useCallback((store: IStore<IAny, IAny>) => {
    onStore?.(store);
  }, [onStore]);

  if (!onStore) {
    return children;
  }

  const child = getNotFragmentChildren(children);

  if (!child) {
    return null;
  }

  if (isValidElement(child)) {
    return cloneElement(child as ReactElement<ChildProps>, { onStore: handleStore });
  }

  return children;
};

/**
 * 递归获取非 Fragment 的子元素
 * @param children React 子元素
 * @returns 处理后的子元素
 */
const getNotFragmentChildren = (children: ReactNode): ReactNode => {
  if (!children) {
    return null;
  }

  if (isFragment(children)) {
    const fragmentChildren = children.props?.children;
    if (!fragmentChildren) {
      return null;
    }

    const validChildren = Array.isArray(fragmentChildren)
      ? fragmentChildren.filter(Boolean)
      : [fragmentChildren];

    if (validChildren.length === 0) {
      return null;
    }

    if (validChildren.length === 1) {
      return getNotFragmentChildren(validChildren[0]);
    }
  }

  return children;
};


export interface WatchChildStoreProps {
  children: ReactNode;
  onStore: (store: IStore<IAny, IAny>) => void;
}

interface ChildProps {
  onStore?: (store: IStore<IAny, IAny>) => void;
  [key: string]: IAny;
}
