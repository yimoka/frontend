import { useAdditionalNode } from '@yimoka/react';
import { Popconfirm as AntPopconfirm, PopconfirmProps as AntPopconfirmProps } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

export const Popconfirm = (props: AntPopconfirmProps) => {
  const { icon, title, description, ...rest } = props;
  const titleNode = useAdditionalNode('title', title);
  const descriptionNode = useAdditionalNode('description', description);

  return (
    <AntPopconfirm
      {...rest}
      description={descriptionNode}
      icon={strToIcon(icon)}
      title={titleNode}
    />
  );
};

export type PopconfirmProps = AntPopconfirmProps;
