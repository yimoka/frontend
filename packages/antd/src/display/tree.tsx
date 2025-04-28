import { PropsWithComponentData, useArrayStringTransform, useComponentData, useSplitter } from '@yimoka/react';
import { IAny, IAnyObject, isVacuous } from '@yimoka/shared';
import { Tree as AntTree, TreeProps as AntTreeProps, Spin, SpinProps } from 'antd';
import { BasicDataNode } from 'antd/es/tree';
import React, { Key, useMemo } from 'react';

import { strToIcon } from '../tools/icon';

export type TreeProps<T extends BasicDataNode = IAnyObject> = PropsWithComponentData<AntTreeProps<T> & {
  data?: T[]
  value?: Key | Key[]
  splitter?: string
  valueType?: 'string' | 'array'
  //  解决新增节点时父节点 key 存在， 新增节点也被勾选，但实际 value 中并没有 子节点的问题
  noParentKey?: boolean
  isValueHasParent?: boolean
  onChange?: (value: Key | Key[]) => void
  loading?: boolean | SpinProps
}>

export const Tree = (props: TreeProps) => {
  const { loading, switcherLoadingIcon, icon, treeData, data, store, dataKey, checkedKeys, value, valueType, splitter, noParentKey, onChange, onCheck, ...args } = props;
  const curData = useComponentData([treeData, data], dataKey, store);
  const curSplitter = useSplitter(splitter);
  const curCheckedKeys = useArrayStringTransform(checkedKeys ?? value, curSplitter) as Key[] | undefined;

  const key = props.fieldNames?.key ?? 'key';

  const hasChildrenMap = useMemo(() => {
    const map = new Map<Key, true>();
    if (!noParentKey) {
      return map;
    }
    const loop = (list: IAny[]) => {
      list.forEach((item) => {
        if (!isVacuous(item.children)) {
          loop(item.children);
          map.set(item[key], true);
        }
      });
    };
    loop(data ?? []);
    return map;
  }, [noParentKey, data, key]);

  if (loading) {
    if (typeof loading === 'boolean') {
      return <Spin />;
    }
    return <Spin {...loading} />;
  }

  return (
    <AntTree
      {...args}
      checkedKeys={curCheckedKeys}
      icon={strToIcon(icon)}
      switcherLoadingIcon={strToIcon(switcherLoadingIcon)}
      treeData={curData}
      onCheck={(checkedKeys, info) => {
        onCheck?.(checkedKeys, info);
        if (onChange) {
          let keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
          if (noParentKey) {
            keys = keys.filter(key => !hasChildrenMap.has(key));
          }
          if (valueType === 'string') {
            onChange(keys.join(splitter));
          } else {
            onChange(keys);
          }
        }
      }}
    />
  );
};

