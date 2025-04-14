import { Tooltip as AntTooltip, TooltipProps as AntTooltipProps } from 'antd';
import React, { useMemo } from 'react';

import { Icon } from '../base/icon';

export const Tooltip = (props: TooltipProps) => {
  const { icon, children, ...args } = props;
  const curChilder = useMemo(() => {
    if (typeof children === 'undefined' || children === null) {
      if (icon) {
        if (typeof icon === 'string') {
          return <Icon name={icon} />;
        }
        return icon;
      }
      return null;
    }
    return children;
  }, [children, icon]);

  return <AntTooltip {...args} children={curChilder} />;
};

export type TooltipProps = AntTooltipProps & {
  icon?: React.ReactNode
}
