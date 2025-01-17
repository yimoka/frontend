import { Pagination as AntPagination, GetProps } from 'antd';
import React from 'react';

export const Pagination = (props: GetProps<typeof AntPagination> & { value?: number }) => {
  const { current, value, ...rest } = props;
  return <AntPagination {...rest} current={current ?? value} />;
};
