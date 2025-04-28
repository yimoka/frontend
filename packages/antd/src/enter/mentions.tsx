import { PropsWithComponentData, useAdditionalNode, useComponentData } from '@yimoka/react';
import { Mentions as AntMentions, MentionsProps as AntMentionsProps } from 'antd';
import React from 'react';

import { handleAllowClear } from '../tools/icon';

export const Mentions = (props: MentionsProps) => {
  const { allowClear, notFoundContent, store, data, dataKey, options, ...rest } = props;
  const curOptions = useComponentData([options, data], dataKey, store);
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);

  return (
    <AntMentions {...rest}
      allowClear={handleAllowClear(allowClear)}
      notFoundContent={curNotFoundContent}
      options={curOptions}
    />);
};

export type MentionsProps = PropsWithComponentData<AntMentionsProps>
