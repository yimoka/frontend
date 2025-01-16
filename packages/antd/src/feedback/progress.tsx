import { Progress as AntProgress, ProgressProps as AntProgressProps } from 'antd';
import React from 'react';

export const Progress = (props: AntProgressProps & { value?: number }) => {
  const { percent, value, ...rest } = props;

  return (
    <AntProgress
      {...rest}
      percent={percent ?? value}
    />
  );
};
