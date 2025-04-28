import { PropsWithComponentData, useAdditionalNode, useComponentData, useStore } from '@yimoka/react';
import { TreeSelect as AntTreeSelect, TreeSelectProps as AntTreeSelectProps } from 'antd';
import React from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

export const TreeSelect = (props: TreeSelectProps) => {
  const {
    store, data, dataKey, treeData,
    notFoundContent, maxTagPlaceholder, prefix, allowClear, suffixIcon,
    ...rest } = props;

  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);
  const curMaxTagPlaceholder = useAdditionalNode('maxTagPlaceholder', maxTagPlaceholder);
  const curPrefix = useAdditionalNode('prefix', prefix);
  const curStore = useStore(store);
  const curTreeData = useComponentData([treeData, data], dataKey, curStore);

  return (
    <AntTreeSelect
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      maxTagPlaceholder={curMaxTagPlaceholder}
      notFoundContent={curNotFoundContent}
      prefix={curPrefix}
      suffixIcon={strToIcon(suffixIcon)}
      treeData={curTreeData}
    />
  );
};

export type TreeSelectProps = PropsWithComponentData<AntTreeSelectProps>;
