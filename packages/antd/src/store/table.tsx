import { observer, RecordsScope, useNavigate, useRecordIndexFn, useSchemaItemsToColumns, useStore, useDeepEffect } from '@yimoka/react';
import { IAny, IAnyObject, isBlank, normalizeToArray } from '@yimoka/shared';
import { IFieldColumn, ListStore, reaction } from '@yimoka/store';
import { TablePaginationConfig } from 'antd';
import { ColumnGroupType, ColumnType, SorterResult } from 'antd/es/table/interface';
import { cloneDeep, isEqual, pick } from 'lodash-es';
import React, { Key, useMemo, useState } from 'react';

import { Table, TableProps } from '../display/table';
import { dataIndexToKey, tableSchemaItemPropsMap } from '../display/table/fn';
import { useTableRowKey } from '../display/table/hook';

const StoreTableFn = <T extends IAnyObject>(props: StoreTableProps<T>) => {
  const { store, bindValue, ...rest } = props;
  const curStore = useStore(store) as ListStore;

  if (isBlank(curStore)) {
    return null;
  }

  if (bindValue) {
    return <StoreBindTable {...rest} store={curStore} />;
  }

  const { listData = [], pagination, loading } = curStore;
  const tProps = { ...rest, dataSource: listData, loading };

  if (!isBlank(pagination) && rest.pagination !== false) {
    const { page, pageSize, total } = pagination;
    tProps.pagination = { defaultPageSize: pageSize, defaultCurrent: page, total, ...rest.pagination };
  }

  return <Table {...tProps} />;
};

export const StoreTable = observer(StoreTableFn) as <T = IAnyObject>(props: StoreTableProps<T>) => React.ReactElement;

const StoreBindTableFn = <T extends IAnyObject>(props: Omit<StoreTableProps<T>, 'bindValue'>) => {
  const { store, pagination, onChange, rowSelection, columns, rowKey, ...rest } = props;
  const [filterValues, setFilterValues] = useState<IAnyObject | null>(null);
  const nav = useNavigate();
  const curStore = useStore(store) as ListStore;
  const { listData = [], pagination: storePagination, loading, fetch, selectedRowKeys, setSelectedRowKeys, options, genURLSearch, setFieldValue, values } = curStore;
  const { bindRoute, updateRouteType } = options ?? {};
  const getRecordIndex = useRecordIndexFn(listData);
  const curRowKey = useTableRowKey(rowKey, getRecordIndex);
  const schemaColumns = useSchemaItemsToColumns(getRecordIndex, tableSchemaItemPropsMap);
  const columnsWithSchema = useMemo(() => [...(columns ?? []), ...(schemaColumns ?? [])], [columns, schemaColumns]);
  const pageKey = options.keys.page;
  const pageSizeKey = options.keys.pageSize;
  const sortOrderKey = options.keys.sortOrder;

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
    if (isBlank(filterValueKeys)) {
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

  const curColumns = useMemo(() => columnsWithSchema.map((column) => {
    const withFilterAndSort = {};
    //  处理过滤和排序
    if (column.enableFilter) {
      // withFilterAndSort.filterValue = filterValues[column.filterValueKey];
    }
    if (column.sorter === true) {
      // withFilterAndSort.sortValue = column.sortValueKey;
    }
    if (!isBlank(withFilterAndSort)) {
      return { ...column, ...withFilterAndSort };
    }
    return column;
  }), [columnsWithSchema]);

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
    (normalizeToArray(sorter)).forEach((item) => {
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
          // if (action === 'filter') {
          //   handleFilters(filters, extra);
          // }
          if (action === 'sort') {
            handleSorter(sorter);
          }
        }}
      />
    </RecordsScope>
  );
};

const StoreBindTable = observer(StoreBindTableFn) as <T = IAnyObject>(props: Omit<StoreTableProps<T>, 'bindValue'>) => React.ReactElement;

export type StoreTableProps<T = IAnyObject> = Omit<TableProps<T>, 'dataSource' | 'data' | 'value' | 'dataKey' | 'store' | 'columns'> & {
  store?: ListStore
  bindValue?: boolean
  columns?: Array<IStoreTableColumn<T>>
}

export interface ISortOrder {
  field: string,
  order: 'ascend' | 'descend' | false
}

export type IStoreTableColumn<T = IAnyObject> = ColumnGroupType<T> | (ColumnType<T> & IFieldColumn & {
  filterValueKey?: string
  // 启用受控筛选
  enableFilter?: boolean
  // 排序参数名
  // sortValueKey?: string
})
