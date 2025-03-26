import { observer } from '@formily/react';
import { useStore } from '@yimoka/react';
import { IStore } from '@yimoka/store';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';

export const Submit = observer((props: Omit<ButtonProps, 'loading' | 'disabled' | 'htmlType'> & { store?: IStore }) => {
  const { store, ...rest } = props;
  const curStore = useStore(store);

  return (
    <Button
      children='提交'
      type='primary'
      {...rest}
      disabled={curStore?.form?.disabled || !!curStore?.form?.errors?.length}
      htmlType='submit'
      loading={curStore?.loading}
    />
  );
});
