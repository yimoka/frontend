import { IAny } from '@yimoka/shared';
import { ItemType } from 'antd/es/menu/interface';
import React, { ReactNode } from 'react';

import { Icon } from '../base/icon';

export const strToIcon: <T = ReactNode>(name: T) => (T | ReactNode) = (name) => {
  if (typeof name === 'string' && name) {
    return <Icon name={name} />;
  }
  return name;
};

export const handleMenuItemIcon = (item?: ItemType<IAny>) => {
  if (item === null) {
    return item;
  }
  let newItem = item;
  if ('icon' in item && typeof item.icon === 'string') {
    newItem = { ...item, icon: strToIcon(item.icon) };
  }
  if ('children' in newItem && newItem.children?.length) {
    newItem.children = newItem.children.map(handleMenuItemIcon);
  }
  return newItem;
};

export const handleAllowClear = <T = ReactNode>(v?: boolean | { clearIcon?: T | string }) => {
  if (typeof v === 'object' && v?.clearIcon) {
    return { clearIcon: strToIcon(v.clearIcon) };
  }
  return v;
};

