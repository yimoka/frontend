import { Button as AntButton, ButtonProps } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

export const Button = (props: ButtonProps) => {
  const { icon, ...args } = props;
  return <AntButton {...args} icon={strToIcon(icon)} />;
};

