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
    store={{}}
    schema={{
      type: 'object',
      properties: {
        descriptions: {
          type: 'void',
          'x-component': 'Descriptions',
          'x-component-props': {
            data: [{ k1: 'v1', k2: 'v2' }],
          },
          items: {
            type: 'object',
            properties: {
              k1: {
                title: 'ID',
                // 'x-hidden': true,
              },
              k2: {
                type: 'void',
                title: 'Name',
                'x-component': 'Tag',
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
