import { Button as AntButton, ButtonProps } from 'antd';
import { ButtonGroupProps } from 'antd/es/button';
import React from 'react';

import { strToIcon } from '../tools/icon';

const ButtonFn = (props: ButtonProps) => {
  const { icon, ...args } = props;
  return <AntButton {...args} icon={strToIcon(icon)} />;
};

export const Button = Object.assign(ButtonFn, {
  Group: AntButton.Group,
});


export type { ButtonProps, ButtonGroupProps };
