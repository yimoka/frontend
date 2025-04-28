import { Pagination as AntPagination, GetProps, PaginationProps } from 'antd';
import React from 'react';

export const Pagination = (props: GetProps<typeof AntPagination> & { value?: number }) => {
  const { current, value, ...rest } = props;
  return <AntPagination {...rest} current={current ?? value} />;
};

export type { PaginationProps };
