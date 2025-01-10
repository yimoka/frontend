import { Table } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const TableDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <TableJSX /> },
      { key: 'schema', label: 'Schema', children: <TableSchema /> },
    ]} />
  </div>
);

export const TableSchema = () => (
  <Entity
    store={{}}
    schema={{
      type: 'object',
      properties: {
        table: {
          type: 'void',
          'x-component': 'Table',
          'x-component-props': {
            dataSource: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }],
          },
          items: {
            type: 'object',
            properties: {
              id: {
                title: 'ID',
                // 'x-hidden': true,
              },
              nameTag: {
                type: 'void',
                title: 'Name',
                'x-component': 'Tag',
                'x-component-props': {
                  color: '{{$record.name === "name1" ? "green" : "red"}}',
                  children: '{{$record.name}}',
                },
              },
              name: {
                title: 'Name',
                'x-component': 'Column',
                'x-component-props': {
                  width: 200,
                },
                properties: {
                  tags: {
                    type: 'void',
                    'x-component': 'Tag',
                    'x-component-props': {
                      color: '{{$value === "name1" ? "green" : "red"}}',
                      children: '{{$value}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
    }}
  />);

export const TableJSX = () => (
  <Table dataSource={[{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }]} columns={[
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
  ]} />
);
