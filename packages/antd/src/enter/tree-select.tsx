import { useAdditionalNode } from '@yimoka/react';
import { TreeSelect as AntTreeSelect, TreeSelectProps as AntTreeSelectProps } from 'antd';
import React from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

export const TreeSelect = (props: TreeSelectProps) => {
  const { notFoundContent, maxTagPlaceholder, prefix, allowClear, suffixIcon, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);
  const curMaxTagPlaceholder = useAdditionalNode('maxTagPlaceholder', maxTagPlaceholder);
  const curPrefix = useAdditionalNode('prefix', prefix);

  return (
    <AntTreeSelect
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      maxTagPlaceholder={curMaxTagPlaceholder}
      notFoundContent={curNotFoundContent}
      prefix={curPrefix}
      suffixIcon={strToIcon(suffixIcon)}
    />
  );
};

export type TreeSelectProps = AntTreeSelectProps;
