import { IRecordIndexFn } from '@yimoka/react';
import { useMemo } from 'react';

import { getTableRowKey } from './fn';

import { TableProps } from '.';

export const useTableRowKey = (rowKey: TableProps['rowKey'], fn?: IRecordIndexFn) => useMemo(() => {
  if (rowKey) {
    return getTableRowKey(rowKey);
  }
  return fn;
}, [fn, rowKey]);
