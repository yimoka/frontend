import { useAdditionalNode } from '@yimoka/react';
import { PopoverProps as AntPopoverProps, Popover as AntPopover } from 'antd';
import React from 'react';

export const Popover = (props: PopoverProps) => {
  const { title, content, ...rest } = props;
  const titleNode = useAdditionalNode('title', title);
  const contentNode = useAdditionalNode('content', content);

  return <AntPopover {...rest} content={contentNode} title={titleNode} />;
};

export type PopoverProps = AntPopoverProps

