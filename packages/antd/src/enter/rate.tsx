import { useAdditionalNode } from '@yimoka/react';
import { Rate as AntRate, RateProps } from 'antd';
import React from 'react';


export const Rate = (props: RateProps) => {
  const { character, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('character', character);

  return <AntRate {...rest} character={curNotFoundContent} />;
};

export type { RateProps };
