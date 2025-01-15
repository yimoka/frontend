import { useAdditionalNode } from '@yimoka/react';
import { Space as AntSpace, SpaceProps } from 'antd';
import React from 'react';

const SpaceFC = (props: SpaceProps) => {
  const { split, ...rest } = props;
  const curSplit = useAdditionalNode('split', split);

  return (
    <AntSpace {...rest} split={curSplit} />
  );
};

export const Space = Object.assign(SpaceFC, AntSpace);

