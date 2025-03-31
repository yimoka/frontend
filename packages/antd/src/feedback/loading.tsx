import { ISize } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { SpinProps } from 'antd';
import React from 'react';

import { Spin } from './spin';

export const Loading = (props: Omit<SpinProps, 'size'> & { loading?: boolean, size?: ISize }) => {
  const { loading, spinning, size, ...rest } = props;

  return <Spin {...rest} size={size as IAny} spinning={spinning ?? loading} />;
};
