import { Descriptions } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const DescriptionsDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <DescriptionsJSX /> },
      { key: 'schema', label: 'Schema', children: <DescriptionsSchema /> },
    ]} />
  </div>
);

export const DescriptionsSchema = () => (
  <Entity
    store={{
      defaultValues: {
        arr: [{ id: 1, name: 'name1' }],
        obj: { id: 1, name: 'name1' },
      },
    }}
    schema={{
      type: 'object',
      properties: {
        arr: {
          type: 'array',
          'x-component': 'Descriptions',
          items: {
            type: 'object',
            properties: {
              id: { title: 'ID' },
              name: { title: 'Name', 'x-component': 'Input' },
            },
          },
        },
        obj: {
          type: 'object',
          'x-component': 'Descriptions',
          items: {
            properties: {
              id: { type: 'string', title: 'ID' },
              name: { type: 'string', title: 'Name', 'x-component': 'Input' },
            },
          },
        },
        descriptions: {
          type: 'void',
          'x-component': 'Descriptions',
          'x-component-props': {
            data: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }],
          },
          items: {
            type: 'object',
            properties: {
              id: { title: 'ID' },
              name: {
                type: 'void',
                title: 'Name',
                'x-component': 'Tag',
                'x-hidden': '{{$value === "name1"}}',
                'x-component-props': {
                  color: 'blue',
                  children: '{{$value}}',
                },
              },
            },
          },
        },
      },
    }}
  />);

export const DescriptionsJSX = () => (
  <Descriptions />
);
