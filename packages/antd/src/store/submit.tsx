import { observer } from '@formily/react';
import { useStore } from '@yimoka/react';
import { IStore } from '@yimoka/store';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';
import { useLocaleComponent } from '../hooks/use-locale';

export const Submit = observer((props: Omit<ButtonProps, 'loading' | 'disabled' | 'htmlType'> & { store?: IStore }) => {
  const { store, ...rest } = props;
  const curStore = useStore(store);
  const locale = useLocaleComponent('Common');

  return (
    <Button
      children={locale.submit}
      type='primary'
      {...rest}
      disabled={curStore?.form?.disabled || !!curStore?.form?.errors?.length}
      htmlType='submit'
      loading={curStore?.loading}
    />
  );
});
