import { useAdditionalNode } from '@yimoka/react';
import { FloatButton as AntFloatButton, FloatButtonGroupProps, FloatButtonProps } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

const FloatButtonFC = (props: FloatButtonProps) => {
  const { icon, description, tooltip, ...args } = props;
  const curDescription = useAdditionalNode('description', description);
  const curTooltip = useAdditionalNode('tooltip', tooltip);

  return (
    <AntFloatButton {...args}
      description={curDescription}
      icon={strToIcon(icon)}
      tooltip={curTooltip}
    />
  );
};

const Group = (props: FloatButtonGroupProps) => {
  const { closeIcon, ...args } = props;
  return <AntFloatButton.Group {...args} closeIcon={strToIcon(closeIcon)} />;
};

export const FloatButton = Object.assign(FloatButtonFC, {
  Group,
  BackTop: AntFloatButton.BackTop,
});
