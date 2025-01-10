// 对表格进行增强 支持 json schema 以及 自动生成 rowKey
import { RecordsScope } from '@formily/react';
import { useRecordIndexFn, useSchemaItemsToColumns } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import React, { useMemo } from 'react';

import { useTableRowKey } from './hook';

const propsMap = { dataIndex: 'name', title: 'title' };

export const Table = <T extends IAnyObject>(props: TableProps<T>) => {
  const { rowKey, dataSource, columns, ...rest } = props;
  const getRecordIndex = useRecordIndexFn(dataSource);
  const curRowKey = useTableRowKey(rowKey, getRecordIndex);
  const schemaColumns = useSchemaItemsToColumns(getRecordIndex, propsMap);

  const curColumns = useMemo(() => [...(schemaColumns ?? []), ...(columns ?? [])], [columns, schemaColumns]);

  return (
    <RecordsScope getRecords={() => (dataSource ?? []) as T[]} >
      <AntTable<T> {...rest} rowKey={curRowKey} dataSource={dataSource} columns={curColumns} />
    </RecordsScope>
  );
};

export type TableProps<T = IAnyObject> = Omit<AntTableProps<T>, 'rowKey'> & {
  // 对于 rowKey 的类型进行增强 支持按照数组的方式
  rowKey?: AntTableProps<T>['rowKey'] | Array<string | number>
};
