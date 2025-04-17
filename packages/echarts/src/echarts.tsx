import React from 'react';

export const Echarts = (props: EchartsProps) => {
  const { value } = props;
  console.log(value);
  return <div>Echarts</div>;
};


export type EchartsProps = {
  value: string;
}
