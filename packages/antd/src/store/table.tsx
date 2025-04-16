/**
 * @file 表格组件与 Store 的集成实现
 * @summary 该模块实现了基于 Store 的表格组件，支持数据绑定、分页、排序、筛选等功能
 */

import { observer, RecordsScope, useNavigate, useRecordIndexFn, useSchemaItemsToColumns, useStore, useDeepEffect } from '@yimoka/react';
import { dataToOptions, getSmart, IAny, IAnyObject, isVacuous, normalizeToArray, setSmart } from '@yimoka/shared';
import { getFieldSplitter, ListStore, reaction } from '@yimoka/store';
import { TablePaginationConfig } from 'antd';
import { ColumnFilterItem, ColumnType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { cloneDeep, isEqual, pick } from 'lodash-es';
import React, { Key, useMemo, useState } from 'react';

import { Table, TableProps } from '../display/table';
import { dataIndexToKey, getTableColumnTitleWithTooltip, tableSchemaItemPropsMap } from '../display/table/fn';
import { useTableRowKey } from '../display/table/hook';

/**
 * StoreTable 组件的实现函数
 * @template T - 表格数据项的类型
 * @param props - 组件属性
 * @returns React 元素
 */
const StoreTableFn = <T extends IAnyObject>(props: StoreTableProps<T>) => {
  const { store, bindValue, ...rest } = props;
  const curStore = useStore(store) as ListStore;

  if (isVacuous(curStore)) {
    return null;
  }

  if (bindValue) {
    return <StoreBindTable {...rest} store={curStore} />;
  }

  const { listData = [], pagination, loading } = curStore;
  const tProps = { ...rest, dataSource: listData, loading };

  if (!isVacuous(pagination) && rest.pagination !== false) {
    const { page, pageSize, total } = pagination;
    tProps.pagination = { defaultPageSize: pageSize, defaultCurrent: page, total, ...rest.pagination };
  }

  return <Table {...tProps} />;
};

export const StoreTable = observer(StoreTableFn) as <T = IAnyObject>(props: StoreTableProps<T>) => React.ReactElement;

/**
 * 绑定 Store 的表格组件实现函数
 * @template T - 表格数据项的类型
 * @param props - 组件属性
 * @returns React 元素
 */
const StoreBindTableFn = <T extends IAnyObject>(props: Omit<StoreTableProps<T>, 'bindValue'>) => {
  const { store, pagination, onChange, rowSelection, columns, rowKey, ...rest } = props;
  const [filterValues, setFilterValues] = useState<IAnyObject | null>(null);
  const nav = useNavigate();
  const curStore = useStore(store) as ListStore;
  const { listData = [], pagination: storePagination, loading, fetch, selectedRowKeys, setSelectedRowKeys, options, genURLSearch, setFieldValue, setValues, values } = curStore;
  const { bindRoute, updateRouteType, keys } = options;
  const getRecordIndex = useRecordIndexFn(listData);
  const curRowKey = useTableRowKey(rowKey, getRecordIndex);
  const schemaColumns = useSchemaItemsToColumns(getRecordIndex, tableSchemaItemPropsMap);
  const columnsWithSchema = useMemo(() => [...(columns ?? []), ...(schemaColumns ?? [])], [columns, schemaColumns]);
  const pageKey = keys.page;
  const pageSizeKey = keys.pageSize;
  const sortOrderKey = keys.sortOrder;

  const filterValueKeys = useMemo(() => {
    const keys: string[] = [];
    columnsWithSchema.forEach((column) => {
      if (column.enableFilter) {
        const { filterValueKey, dataIndex } = column;
        const key = filterValueKey ?? dataIndexToKey(dataIndex);
        keys.push(key);
      }
    });
    return keys;
  }, [columnsWithSchema]);

  // store 的 value 更新时 更新 filterValues
  useDeepEffect(() => {
    if (isVacuous(filterValueKeys)) {
      return;
    }
    const disposer = reaction(() => {
      const fValue = pick(values, filterValueKeys);
      if (!isEqual(fValue, filterValues)) {
        setFilterValues(cloneDeep(fValue));
      }
      return fValue;
    }, (newVal) => {
      if (!isEqual(newVal, filterValues)) {
        setFilterValues(cloneDeep(newVal));
      }
    });
    return () => disposer();
  }, [filterValueKeys, values, filterValues]);

  const curPagination = useMemo(() => {
    if (pagination === false) {
      return false;
    }
    const { page, pageSize, total } = storePagination ?? {};
    return {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `总共 ${total} 条记录`,
      ...pagination,
      current: page,
      pageSize,
      total,
    };
  }, [pagination, storePagination]);

  // eslint-disable-next-line complexity
  const curColumns = useMemo(() => columnsWithSchema.map((column) => {
    const withFilterAndSortAndTitle: ColumnType<T> = {};
    const { dataIndex, key, filters, title } = column;
    const keyValue = dataIndexToKey(key ?? dataIndex);
    const curTitle = getTableColumnTitleWithTooltip(column, curStore);
    if (curTitle !== title) {
      withFilterAndSortAndTitle.title = curTitle;
    }
    //  处理过滤和排序
    if (column.autoFilter === true) {
      const fVal = getSmart(values, keyValue);
      if (Array.isArray(fVal)) {
        withFilterAndSortAndTitle.filteredValue = fVal;
      } else if (typeof fVal === 'string' && fVal) {
        withFilterAndSortAndTitle.filteredValue = fVal.split(getFieldSplitter(dataIndex, curStore) ?? ',');
      } else if (isVacuous(fVal)) {
        withFilterAndSortAndTitle.filteredValue = null;
      } else {
        withFilterAndSortAndTitle.filteredValue = [fVal];
      }
      if (!filters) {
        let options: IAnyObject[] = [];
        const metaDict = curStore.response?.meta?.dict;
        if (metaDict) {
          // 尝试从 metaDict 中取
          options = getSmart(metaDict, keyValue, []);
        }
        if (isVacuous(options)) {
          // 尝试从字典中取
          options = getSmart(curStore.dict, keyValue, []);
        }
        if (!isVacuous(options)) {
          withFilterAndSortAndTitle.filters = dataToOptions<keyof ColumnFilterItem>(options, { keys: { label: 'label', value: 'value' } }) as ColumnFilterItem[];
        }
      }
    }
    if (column.sorter === true) {
      const sorterValue = getSmart(values, sortOrderKey);
      if (Array.isArray(sorterValue)) {
        const sorter = sorterValue.find(item => item.field === keyValue);
        if (sorter) {
          withFilterAndSortAndTitle.sortOrder = sorter.order;
        }
      }
    }
    if (!isVacuous(withFilterAndSortAndTitle)) {
      return { ...column, ...withFilterAndSortAndTitle };
    }
    return column;
  }), [columnsWithSchema, curStore, sortOrderKey, values]);

  const curRowSelection = useMemo(() => (rowSelection
    ? {
      selectedRowKeys,
      ...rowSelection,
      onChange: (keys: Key[], selectedRows: T[], info: IAny) => {
        rowSelection?.onChange?.(keys, selectedRows, info);
        setSelectedRowKeys?.(keys);
      },
    }
    : rowSelection
  ), [rowSelection, selectedRowKeys, setSelectedRowKeys]);

  const queryData = () => {
    fetch();
    setSelectedRowKeys?.();
    if (bindRoute) {
      const { pathname, search } = location;
      const valSearch = genURLSearch();
      if (search !== `?${valSearch}`) {
        nav(`${pathname}?${valSearch}`, { replace: updateRouteType === 'replace' });
      }
    }
  };

  const handlePagination = (pagination: TablePaginationConfig) => {
    setFieldValue(pageKey, pagination.current);
    setFieldValue(pageSizeKey, pagination.pageSize);
    queryData();
  };

  const handleSorter = (sorter: SorterResult<IAnyObject> | SorterResult<IAnyObject>[]) => {
    const val: ISortOrder[] = [];
    normalizeToArray(sorter).forEach((item) => {
      const { field, columnKey, order } = item;
      const keys = columnKey ?? field;
      const key = dataIndexToKey(Array.isArray(keys) ? keys : [keys]);
      if (typeof order === 'string') {
        val.push({ field: `${key}`, order });
      };
    });
    setFieldValue(pageKey, 1);
    setFieldValue(sortOrderKey, val);
    queryData();
  };

  const handleFilters = (filters: Record<string, FilterValue | null>) => {
    const newValues: IAnyObject = {};

    Object.entries(filters).forEach(([key, value]) => {
      const val = value === null ? [] : value;
      const col = columnsWithSchema.find((item) => {
        if (item.key === key) {
          return true;
        }
        if ('dataIndex' in item) {
          const index = dataIndexToKey(item.dataIndex);
          return index === key;
        }
        return false;
      });
      if (col) {
        let fVal: unknown;

        const keyValue = col.filterValueKey ?? key;
        const oldVal = getSmart(values, keyValue);
        if (col?.filterMultiple === false) {
          fVal = val?.[0];
        } else if (typeof oldVal === 'string') {
          fVal = val.join(getFieldSplitter(col.dataIndex, curStore) ?? ',');
        } else {
          fVal = val;
        }
        if (!isEqual(fVal, oldVal)) {
          setSmart(newValues, keyValue, fVal);
        }
      }
    });
    if (!isVacuous(newValues)) {
      setFieldValue(pageKey, 1);
      setValues(newValues);
      queryData();
    }
  };

  return (
    <RecordsScope getRecords={() => listData} >
      <Table
        {...rest}
        columns={curColumns}
        dataSource={listData}
        loading={loading}
        pagination={curPagination}
        rowKey={curRowKey}
        rowSelection={curRowSelection}
        onChange={(pagination, filters, sorter, extra) => {
          onChange?.(pagination, filters, sorter, extra);
          const { action } = extra;
          if (action === 'paginate') {
            handlePagination(pagination);
          }
          if (action === 'filter') {
            handleFilters(filters);
          }
          if (action === 'sort') {
            handleSorter(sorter);
          }
        }}
      />
    </RecordsScope>
  );
};

const StoreBindTable = observer(StoreBindTableFn) as <T = IAnyObject>(props: Omit<StoreTableProps<T>, 'bindValue'>) => React.ReactElement;

/**
 * 表格组件的属性类型定义
 * @template T - 表格数据项的类型
 */
export type StoreTableProps<T = IAnyObject> = Omit<TableProps<T>, 'dataSource' | 'data' | 'value' | 'dataKey' | 'store'> & {
  /** Store 实例 */
  store?: ListStore
  /** 是否绑定值 */
  bindValue?: boolean
}

/**
 * 排序顺序的类型定义
 */
export interface ISortOrder {
  /** 排序字段 */
  field: string,
  /** 排序方向 */
  order: 'ascend' | 'descend' | false
}
