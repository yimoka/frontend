import { Button as AntButton, ButtonProps } from 'antd';
import React, { forwardRef } from 'react';

import { strToIcon } from '../tools/icon';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { icon, ...args } = props;
  return <AntButton {...args} ref={ref} icon={strToIcon(icon)} />;
});

