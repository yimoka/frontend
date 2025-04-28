import { useStore } from '@yimoka/react';
import { IStore } from '@yimoka/store';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';
import { useLocaleComponent } from '../hooks/use-locale';

export const Reset = (props: ButtonProps & { store?: IStore }) => {
  const { onClick, onKeyDown, store, ...rest } = props;
  const curStore = useStore(store);
  const locale = useLocaleComponent('Common');

  return (
    <Button
      children={locale.reset}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        curStore?.resetValues();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === 'Enter') {
          curStore?.resetValues();
        }
      }}
    />
  );
};
