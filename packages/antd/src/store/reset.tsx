import { useStore } from '@yimoka/react';
import { IStore } from '@yimoka/store';
import { ButtonProps, ConfigProvider } from 'antd';
import React, { useContext } from 'react';

import { Button } from '../base/button';

export const Reset = (props: ButtonProps & { store?: IStore }) => {
  const { onClick, onKeyDown, store, ...rest } = props;
  const curStore = useStore(store);
  const context = useContext(ConfigProvider.ConfigContext);
  const filterReset = context.locale?.Table?.filterReset;

  return (
    <Button
      children={filterReset}
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
