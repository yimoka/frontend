import { observer } from '@formily/react';
import { IAny } from '@yimoka/shared';
import React, { ComponentType, FC } from 'react';

import { useConfigComponents } from '../context/config';

import { RenderAny } from './render-any';

export interface TriggerProps extends React.HTMLAttributes<unknown> {
  // 触发事件
  onTrig?: (...args: IAny) => IAny | Promise<IAny>,
  // 触发事件类型
  trigEvent?: 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur' | string
  component: ComponentType | string
  [key: string]: IAny
}

export const Trigger: FC<TriggerProps> = observer((props) => {
  const { onTrig, trigEvent = 'onClick', component, ...args } = props;
  const components = useConfigComponents();
  const curComponent = typeof component === 'string' ? components?.[component] : component;

  const eventProps: Record<string, IAny> = {
    [trigEvent]: (...rest: IAny) => {
      onTrig?.(...rest);
      const event = args?.[trigEvent];
      if (typeof event === 'function') {
        event(...rest);
      };
    },
  };

  const cProps = { ...args, ...eventProps };
  if (curComponent) {
    return <RenderAny value={curComponent} {...cProps} />;
  }
  return null;
});
