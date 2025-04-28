import { IAny } from '@yimoka/shared';
import React from 'react';

import { RenderArrayProps } from '../../components/array/render-array';
import { Entity } from '../../components/entity/base';
import { RenderAny } from '../../components/render-any';
import { useComponentData } from '../../hooks/component-data';
import { useRecordIndexFn } from '../record-index-fn';
import { useSchemaItemsToColumns } from '../schema-items-to-columns';

export const Table = (props: RenderArrayProps) => {
  const { data, dataKey, store, value } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const getRecordIndex = useRecordIndexFn(curData);
  const columns = useSchemaItemsToColumns(getRecordIndex, { title: 'title', dataIndex: 'name' });

  return (
    <table>
      <thead>
        <tr>
          {columns?.map((column: IAny, index: number) => <th key={index}>
            {column.title}
            {column.toolip && <small className='tooltip'>{column.toolip}</small>}
          </th>)}
        </tr>
      </thead>
      <tbody>
        {curData?.map((record: IAny, index: number) => <tr key={index}>
          {columns?.map((column: IAny, index: number) => <td key={index}>
            {column.children?.length > 0 && column.children.map((child: IAny, childIndex: number) => (
              <div key={childIndex}>
                {typeof child.render === 'function'
                  ? child.render(record[child.dataIndex], record)
                  : <RenderAny value={record[child.dataIndex]} />}
              </div>
            ))}
            {typeof column.render === 'function'
              ? column.render(record[column.dataIndex], record)
              : <RenderAny value={record[column.dataIndex]} />
            }
          </td>)}
        </tr>)
        }
      </tbody>
    </table>
  );
};

export const TableDemo = () => (
  <Entity
    schema={{
      type: 'object',
      properties: {
        arr: {
          type: 'void',
          'x-component': Table,
          'x-component-props': {
            dataKey: 'values.arr',
          },
          items: {
            type: 'object',
            properties: {
              name: {
                title: '姓名',
                'x-component': 'div',
                'x-component-props': {
                  style: { width: 100 },
                  children: '{{$value}}',
                },
              },
              age: {
                title: '年龄',
                'x-component': 'div',
                'x-component-props': {
                  children: '{{$value}}',
                },
              },
            },
          },
        },
      },
    }}
    scope={{
      $config: {
        fieldsConfig: {
          name: {
            'x-column': {
              toolip: '标题的提示',
            },
          },
        },
      },
    }}
    store={{
      defaultValues: {
        arr: [
          { name: '张三', age: 18, address: '北京', sex: '男' },
          { name: '李四', age: 20, address: '上海', sex: '女' },
        ],
      },
    }}
  />
);
