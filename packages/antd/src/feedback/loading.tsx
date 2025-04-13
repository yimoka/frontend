import { ISize } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { SpinProps as AntSpinProps } from 'antd';
import React from 'react';

import { Spin } from './spin';

export const Loading = (props: SpinProps) => {
  const { loading, spinning, size, ...rest } = props;

  return <Spin {...rest} size={size as IAny} spinning={spinning ?? loading} />;
};

export type SpinProps = Omit<AntSpinProps, 'size'> & { loading?: boolean, size?: ISize }
