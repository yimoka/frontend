import { useAdditionalNode } from '@yimoka/react';
import { AutoComplete as AntAutoComplete, AutoCompleteProps } from 'antd';
import React from 'react';

import { handleAllowClear } from '../tools/icon';

export const AutoComplete = (props: AutoCompleteProps) => {
  const { notFoundContent, allowClear, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);

  return <AntAutoComplete {...rest} allowClear={handleAllowClear(allowClear)} notFoundContent={curNotFoundContent} />;
};

export type { AutoCompleteProps };
