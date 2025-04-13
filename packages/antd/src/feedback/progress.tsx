import { Progress as AntProgress, ProgressProps as AntProgressProps } from 'antd';
import React from 'react';

export const Progress = (props: ProgressProps) => {
  const { percent, value, ...rest } = props;

  return (
    <AntProgress
      {...rest}
      percent={percent ?? value}
    />
  );
};

export type ProgressProps = AntProgressProps & { value?: number }
