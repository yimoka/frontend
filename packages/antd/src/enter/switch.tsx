import { useAdditionalNode } from '@yimoka/react';
import { Switch as AntSwitch, SwitchProps as AntSwitchProps } from 'antd';
import React from 'react';

export const Switch = (props: SwitchProps) => {
  const { checkedChildren, unCheckedChildren, ...rest } = props;
  const curCheckedChildren = useAdditionalNode('checkedChildren', checkedChildren);
  const curUnCheckedChildren = useAdditionalNode('unCheckedChildren', unCheckedChildren);

  return <AntSwitch {...rest} checkedChildren={curCheckedChildren} unCheckedChildren={curUnCheckedChildren} />;
};

export type SwitchProps = AntSwitchProps;
