import { IAny } from '@yimoka/shared';
import { useMemo } from 'react';

import { getTableRowKey } from './fn';

import { TableProps } from '.';

export const useTableRowKey = (rowKey: TableProps['rowKey'], fn?: (record: IAny) => number) => useMemo(() => {
  if (rowKey) {
    return getTableRowKey(rowKey);
  }
  return fn;
}, [fn, rowKey]);


export const useTableRecordIndex = (dataSource?: readonly IAny[] | IAny[]) => useMemo(() => {
  // 利用闭包 按需生成
  let recordIndexMap: Map<IAny, number>;
  return (record: IAny) => {
    if (!recordIndexMap) {
      recordIndexMap = new Map();
      dataSource?.forEach((item, index: number) => {
        recordIndexMap.set(item, index);
      });
    }
    return recordIndexMap.get(record) ?? 0;
  };
}, [dataSource]);
