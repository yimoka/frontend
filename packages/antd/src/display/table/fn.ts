import { IAnyObject } from '@yimoka/shared';
import { TableProps as AntTableProps } from 'antd';
import { get } from 'lodash-es';

import { TableProps } from '.';

export function getTableRowKey(rowKey: TableProps['rowKey']): AntTableProps['rowKey'] {
  if (Array.isArray(rowKey)) {
    return (record: IAnyObject) => rowKey.map(key => get(record, `${key}`)).join('_');
  }
  if (typeof rowKey === 'number') {
    return rowKey?.toString();
  }
  return rowKey;
};
