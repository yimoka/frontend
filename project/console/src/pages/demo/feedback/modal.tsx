import { Modal } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const ModalDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <ModalJSX /> },
      { key: 'schema', label: 'Schema', children: <ModalSchema /> },
    ]} />
  </div>
);

const onOpen = () => console.log('onOpen');


export const ModalSchema = () => (
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
          'x-component': 'Modal',
          'x-component-props': {
            title: 'Modal',
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
          'x-component': 'Modal',
          'x-component-props': {
            onOpen,
            trigger: {
              component: 'Icon',
              name: 'EditOutlined',
              trigEvent: 'onMouseEnter',
            },
            title: 'Modal',
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

export const ModalJSX = () => (
  <>
    <Modal
      title="Modal"
      onOpen={onOpen}
    >
      <div>Content</div>
    </Modal>
    <Modal
      title="Modal"
      onOpen={onOpen}
      trigger={{
        component: 'Icon',
        name: 'EditOutlined',
        trigEvent: 'onMouseEnter',
      }}
    >
      <div>Content</div>
    </Modal>
  </>
);
