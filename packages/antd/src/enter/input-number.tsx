import { useAdditionalNode } from '@yimoka/react';
import { InputNumber as AntInputNumber, InputNumberProps as AntInputNumberProps } from 'antd';
import React from 'react';


export const InputNumber = (props: InputNumberProps) => {
  const { prefix, suffix, addonBefore, addonAfter, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInputNumber
      {...rest}
      addonAfter={curAddonAfter}
      addonBefore={curAddonBefore}
      prefix={curPrefix}
      suffix={curSuffix}
    />);
};

export type InputNumberProps = AntInputNumberProps;
