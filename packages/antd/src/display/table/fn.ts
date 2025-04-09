import { getAutoFilterConfig, getSorterFn, IAnyObject, isBlank } from '@yimoka/shared';
import { TableProps as AntTableProps } from 'antd';
import { ColumnType } from 'antd/es/table';
import { get } from 'lodash-es';

import { TableProps } from '.';

export const tableSchemaItemPropsMap = { dataIndex: 'name', title: 'title' };


export function getTableRowKey(rowKey: TableProps['rowKey']): AntTableProps['rowKey'] {
  if (Array.isArray(rowKey)) {
    return (record: IAnyObject) => rowKey.map(key => get(record, `${key}`)).join('_');
  }
  if (typeof rowKey === 'number') {
    return rowKey?.toString();
  }
  return rowKey;
};

export function getTableColumnsWithAutoFilterAndSorter(columns: TableProps['columns'], data: IAnyObject[]): AntTableProps['columns'] {
  return columns?.map((column) => {
    const newColumn: ColumnType = {};
    if ('autoFilter' in column) {
      const { autoFilter, dataIndex, key, filteredValue, filters, onFilter } = column;
      if (autoFilter && autoFilter !== true && [filters, filteredValue, onFilter].every(v => typeof v === 'undefined')) {
        const path = dataIndex ? dataIndexToKey(dataIndex) : key;
        const { filters, onFilter } = getAutoFilterConfig(autoFilter, data, path);
        newColumn.filters = filters;
        newColumn.onFilter = onFilter;
      }
    }
    if ('autoSorter' in column) {
      const { autoSorter, sorter, sortOrder } = column;
      if (autoSorter && [sorter, sortOrder].every(v => typeof v === 'undefined')) {
        const sorterFn = getSorterFn(column);
        newColumn.sorter = sorterFn;
      }
    }
    if (!isBlank(newColumn)) {
      return { ...column, ...newColumn };
    }
    return column;
  });
}

export function dataIndexToKey<T = IAnyObject>(dataIndex?: DataIndex<T>) {
  return (Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex) as string;
};

export type DataIndex<T = IAnyObject> = Required<ColumnType<T>>['dataIndex']
