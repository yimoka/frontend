import { useAdditionalNode } from '@yimoka/react';
import { BadgeProps as AntBadgeProps, Badge as AntBadge } from 'antd';
import { RibbonProps } from 'antd/lib/badge/Ribbon';
import React from 'react';

const BadgeFC = (props: BadgeProps) => {
  const { count, text, value, ...rest } = props;
  const textNode = useAdditionalNode('text', text);
  const countNode = useAdditionalNode('count', count);

  return <AntBadge {...rest} count={countNode ?? value} text={textNode} />;
};

const Ribbon = (props: RibbonProps) => {
  const { text, ...rest } = props;
  const textNode = useAdditionalNode('text', text);

  return <AntBadge.Ribbon {...rest} text={textNode} />;
};

export const Badge = Object.assign(BadgeFC, { Ribbon });

export type BadgeProps = AntBadgeProps & { value?: BadgeProps['count'] };

export type { RibbonProps };
