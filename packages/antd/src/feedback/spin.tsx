import { useAdditionalNode } from '@yimoka/react';
import { Spin as AntSpin, SpinProps as AntSpinProps } from 'antd';
import React from 'react';

export const Spin = (props: AntSpinProps) => {
  const { indicator, tip, ...rest } = props;
  const indicatorNode = useAdditionalNode('indicator', indicator) as AntSpinProps['indicator'];
  const tipNode = useAdditionalNode('tip', tip);

  return (
    <AntSpin
      {...rest}
      indicator={indicatorNode}
      tip={tipNode}
    />
  );
};
