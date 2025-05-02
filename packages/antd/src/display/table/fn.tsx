import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTooltipProps, RenderAny } from '@yimoka/react';
import { getAutoFilterConfig, getSorterFn, IAnyObject, IAutoFilter, IAutoSorter, isVacuous } from '@yimoka/shared';
import { BaseStore } from '@yimoka/store';
import { TableProps as AntTableProps, Space, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { get } from 'lodash-es';

import React from 'react';

import { ITableColumn, TableProps } from '.';

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

// eslint-disable-next-line complexity
export function getTableColumnWithAutoFilterAndSorter(column: ITableColumn, data: IAnyObject[]): ITableColumn {
  const newColumn: ColumnType = {};
  const { key } = column;
  const dataIndex = 'dataIndex' in column ? column.dataIndex : undefined;
  const path = dataIndex ? dataIndexToKey(dataIndex) : key;

  if ('autoFilter' in column) {
    const { autoFilter, filteredValue, onFilter } = column;
    if (autoFilter && autoFilter !== true && [filteredValue, onFilter].every(v => typeof v === 'undefined')) {
      const { filters, onFilter } = getAutoFilterConfig(autoFilter, data, path);
      if (typeof column.filters === 'undefined') {
        newColumn.filters = filters;
      }
      newColumn.onFilter = onFilter;
    }
  }
  if ('autoSorter' in column) {
    const { autoSorter, sorter, sortOrder } = column;
    if (autoSorter && [sorter, sortOrder].every(v => typeof v === 'undefined')) {
      const sorterFn = getSorterFn(column, path);
      if (typeof sorterFn === 'function') {
        newColumn.sorter = (a, b) => sorterFn(a, b);
      }
    }
  }
  if (!isVacuous(newColumn)) {
    const { autoSorter, autoFilter, ...rest } = column as ITableColumn & { autoSorter?: IAutoSorter, autoFilter?: IAutoFilter };
    const result: IAnyObject = { ...rest, ...newColumn };
    console.log('result', result);
    return result;
  }
  return column;
}

export function dataIndexToKey<T = IAnyObject>(dataIndex?: DataIndex<T>) {
  return (Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex) as string;
};

export type DataIndex<T = IAnyObject> = Required<ColumnType<T>>['dataIndex']


export function getTableColumnTitleWithTooltip(column: ITableColumn, store?: BaseStore) {
  const { title, tooltip } = column;
  let curTitle = title;
  if (tooltip === false) {
    return title;
  }
  let colKey = column.key;

  if (typeof colKey === 'undefined' && 'dataIndex' in column) {
    colKey = dataIndexToKey(column.dataIndex);
    if (typeof curTitle === 'undefined') {
      curTitle = store?.fieldsConfig?.[colKey]?.title;
    }
  }
  const curTooltip = getTooltipProps(tooltip, `${colKey}`, store);

  if (!isVacuous(curTooltip)) {
    return (
      <Space>
        <RenderAny value={curTitle} />
        <Tooltip children={<QuestionCircleOutlined />} {...curTooltip} />
      </Space>
    );
  }
  return curTitle;
}
