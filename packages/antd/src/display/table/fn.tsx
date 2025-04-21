import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTooltipProps, RenderAny } from '@yimoka/react';
import { getAutoFilterConfig, getSorterFn, IAnyObject, isVacuous } from '@yimoka/shared';
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

export function getTableColumnWithAutoFilterAndSorter(column: ITableColumn, data: IAnyObject[]): ITableColumn {
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
  if (!isVacuous(newColumn)) {
    const result: IAnyObject = { ...column, ...newColumn };
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
