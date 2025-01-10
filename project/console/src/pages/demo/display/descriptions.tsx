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
          },
          // 理论上来讲 void 不存在 items,
          // 这里为了 'x-component': 'Descriptions' 里的 items 能够支持 lowCode 使用 items
          // 所以这里显示声明 items 为 void
          items: {
            type: 'void',
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
                  children: '123',
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
