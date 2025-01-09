// 对表格进行增强 支持 json schema 以及 自动生成 rowKey
import { IAnyObject } from '@yimoka/shared';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';

import React from 'react';

import { useTableRecordIndex, useTableRowKey } from './hook';

export const Table = <T extends IAnyObject>(props: TableProps<T>) => {
  const { rowKey, dataSource, ...rest } = props;
  const getRecordIndex = useTableRecordIndex(dataSource);
  const curRowKey = useTableRowKey(rowKey, getRecordIndex);

  return <AntTable<T> {...rest} rowKey={curRowKey} dataSource={dataSource} />;
};

export type TableProps<T = IAnyObject> = Omit<AntTableProps<T>, 'rowKey'> & {
  // 对于 rowKey 的类型进行增强 支持按照数组的方式
  rowKey?: AntTableProps<T>['rowKey'] | Array<string | number>
};
