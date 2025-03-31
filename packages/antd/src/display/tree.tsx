import { PropsWithComponentData, useComponentData } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import { Tree as AntTree, TreeProps as AntTreeProps } from 'antd';
import { BasicDataNode } from 'antd/es/tree';
import React, { Key, useMemo } from 'react';

import { strToIcon } from '../tools/icon';

export type TreeProps<T extends BasicDataNode = IAnyObject> = PropsWithComponentData<AntTreeProps<T> & {
  data?: T[]
  value?: Key | Key[]
  splitter?: string
  valueType?: 'string' | 'array'
  onChange?: (value: Key | Key[]) => void
}>

export const Tree = (props: TreeProps) => {
  const { switcherLoadingIcon, icon, treeData, data, store, dataKey, checkedKeys, value, valueType, splitter = ',',
    onChange, onCheck, ...args } = props;
  const curData = useComponentData([treeData, data], dataKey, store);

  const curCheckedKeys = useMemo(() => {
    if (typeof checkedKeys !== 'undefined') {
      return checkedKeys;
    }
    if (typeof value === 'string') {
      return value.split(splitter);
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  }, [checkedKeys, splitter, value]);

  return (
    <AntTree {...args}
      checkedKeys={curCheckedKeys}
      icon={strToIcon(icon)}
      switcherLoadingIcon={strToIcon(switcherLoadingIcon)}
      treeData={curData}
      onCheck={(checkedKeys, info) => {
        onCheck?.(checkedKeys, info);
        if (onChange) {
          const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
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

