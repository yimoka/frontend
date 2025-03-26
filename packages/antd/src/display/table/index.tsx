// 对表格进行增强 支持 json schema 以及 自动生成 rowKey
import { RecordsScope } from '@formily/react';
import { observer, useComponentData, useRecordIndexFn, useSchemaItemsToColumns } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import React, { useMemo } from 'react';

import { useTableRowKey } from './hook';

const propsMap = { dataIndex: 'name', title: 'title' };

const TableFn = <T extends IAnyObject>(props: TableProps<T>) => {
  const { rowKey, dataSource, columns, value, dataKey, store, ...rest } = props;
  const data = useComponentData([dataSource, value], dataKey, store);
  const getRecordIndex = useRecordIndexFn(data);
  const curRowKey = useTableRowKey(rowKey, getRecordIndex);
  const schemaColumns = useSchemaItemsToColumns(getRecordIndex, propsMap);
  const curColumns = useMemo(() => [...(schemaColumns ?? []), ...(columns ?? [])], [columns, schemaColumns]);

  return (
    <RecordsScope getRecords={() => (data ?? []) as T[]} >
      <AntTable<T>
        {...rest}
        columns={curColumns}
        dataSource={data}
        rowKey={curRowKey} />
    </RecordsScope>
  );
};

export const Table = observer(TableFn);

export type TableProps<T = IAnyObject> = Omit<AntTableProps<T>, 'rowKey'> & {
  // 对于 rowKey 的类型进行增强 支持按照数组的方式
  rowKey?: AntTableProps<T>['rowKey'] | Array<string | number>
  value?: T[];
  dataKey?: string;
  store?: IStore | false
};
