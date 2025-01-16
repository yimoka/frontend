import Icon from '@ant-design/icons';
import React, { ReactNode } from 'react';

export const strToIcon: <T = ReactNode>(name: T) => (T | ReactNode) = (name) => {
  if (typeof name === 'string' && name) {
    return <Icon name={name} />;
  }
  return name;
};

export const handleAllowClear = <T = ReactNode>(v?: boolean | { clearIcon?: T | string }) => {
  if (typeof v === 'object' && v?.clearIcon) {
    return { clearIcon: strToIcon(v.clearIcon) };
  }
  return v;
};
