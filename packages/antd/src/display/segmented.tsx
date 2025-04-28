import { PropsWithComponentData, useComponentData, useStore } from '@yimoka/react';
import { Segmented as AntSegmented, SegmentedProps as AntSegmentedProps } from 'antd';
import React from 'react';


export const Segmented = (props: SegmentedProps) => {
  const { store, data, dataKey, options, ...rest } = props;
  const curStore = useStore(store);
  const curOptions = useComponentData([options, data], dataKey, curStore);

  return (<AntSegmented {...rest} options={curOptions} />);
};

export type SegmentedProps = PropsWithComponentData<AntSegmentedProps>;
