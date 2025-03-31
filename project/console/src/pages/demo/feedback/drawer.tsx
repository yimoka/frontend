import { Drawer } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const DrawerDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema"
items={[
  { key: 'JSX', label: 'JSX 调用', children: <DrawerJSX /> },
  { key: 'schema', label: 'Schema', children: <DrawerSchema /> },
]} />
  </div>
);

const onOpen = () => console.log('onOpen');


export const DrawerSchema = () => (
  <Entity
    schema={{
      type: 'object',
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Drawer',
          'x-component-props': {
            title: 'Drawer',
            onOpen,
          },
          properties: {
            name: {
              type: 'string',
              title: '姓名',
              'x-component': 'Input',
            },
          },
        },
        icon: {
          type: 'void',
          'x-decorator': 'Tag',
          'x-component': 'Drawer',
          'x-component-props': {
            onOpen,
            trigger: {
              component: 'Icon',
              name: 'EditOutlined',
              trigEvent: 'onMouseEnter',
            },
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
    store={{
      defaultValues: {
        name: 'name',
      },
    }}
  />);

export const DrawerJSX = () => (
  <>
    <Drawer
      title="Drawer"
      onOpen={onOpen}
    >
      <div>Content</div>
    </Drawer>
    <Drawer
      title="Drawer"
      trigger={{
        component: 'Icon',
        name: 'EditOutlined',
        trigEvent: 'onMouseEnter',
      }}
      onOpen={onOpen}
    >
      <div>Content</div>
    </Drawer>
  </>
);
