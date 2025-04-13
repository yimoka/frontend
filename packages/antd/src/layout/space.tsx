import { useAdditionalNode } from '@yimoka/react';
import { Space as AntSpace, SpaceProps } from 'antd';
import { SpaceCompactProps } from 'antd/es/space/Compact';
import React from 'react';

const SpaceFC = (props: SpaceProps) => {
  const { split, ...rest } = props;
  const curSplit = useAdditionalNode('split', split);

  return (
    <AntSpace {...rest} split={curSplit} />
  );
};

export const Space = Object.assign(SpaceFC, AntSpace);

export type { SpaceProps, SpaceCompactProps };
