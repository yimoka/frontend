import { Drawer } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const DrawerDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <DrawerJSX /> },
      { key: 'schema', label: 'Schema', children: <DrawerSchema /> },
    ]} />
  </div>
);

export const DrawerSchema = () => (
  <Entity
    store={{
      defaultValues: {
        name: 'name',
      },
    }}
    schema={{
      type: 'object',
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Drawer',
          'x-component-props': {
            title: 'Drawer',
          },
          properties: {
            name: {
              type: 'string',
              title: '姓名',
              'x-component': 'Input',
            },
          },
        },
      },
    }}
  />);

export const DrawerJSX = () => (
  <Drawer />
);
