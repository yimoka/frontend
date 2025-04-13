import { useAdditionalNode } from '@yimoka/react';
import { Empty as AntEmpty, EmptyProps } from 'antd';
import React from 'react';

export const Empty = (props: EmptyProps) => {
  const { description, image, ...args } = props;
  const descriptionNode = useAdditionalNode('text', description);
  const imageNode = useAdditionalNode('image', image);

  return <AntEmpty {...args} description={descriptionNode} image={imageNode} />;
};

export type { EmptyProps };
