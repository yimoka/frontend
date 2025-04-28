import { useAdditionalNode } from '@yimoka/react';
import { Spin as AntSpin, SpinProps } from 'antd';
import React from 'react';

export const Spin = (props: SpinProps) => {
  const { indicator, tip, ...rest } = props;
  const indicatorNode = useAdditionalNode('indicator', indicator) as SpinProps['indicator'];
  const tipNode = useAdditionalNode('tip', tip);

  return (
    <AntSpin
      {...rest}
      indicator={indicatorNode}
      tip={tipNode}
    />
  );
};

