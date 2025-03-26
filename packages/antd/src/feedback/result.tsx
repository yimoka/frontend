import { useAdditionalNode } from '@yimoka/react';
import { Result as AntResult, ResultProps as AntResultProps } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

export const Result = (props: AntResultProps) => {
  const { icon, title, extra, subTitle, ...rest } = props;
  const titleNode = useAdditionalNode('title', title);
  const descriptionNode = useAdditionalNode('description', subTitle);
  const extraNode = useAdditionalNode('extra', extra);

  return (
    <AntResult
      {...rest}
      extra={extraNode}
      icon={strToIcon(icon)}
      subTitle={descriptionNode}
      title={titleNode}
    />
  );
};
