import { Button, Space } from '@yimoka/antd';
import { Entity, Trigger } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const TriggerDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <TriggerJSX /> },
      { key: 'schema', label: 'Schema', children: <TriggerSchema /> },
    ]} />
  </div>
);

const api = () => {
  console.log(' fetch api');
  return { code: 0, msg: '', data: {} };
};

export const TriggerSchema = () => (
  <Entity
    store={{ api }}
    schema={
      {
        type: 'object',
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              trigger: {
                type: 'object',
                'x-component': 'Trigger',
                'x-component-props': {
                  onClick: '{{$store.fetch}}',
                  trigEvent: 'onClick',
                  component: 'Button',
                  children: '触发',
                },
              },
              triggerChild: {
                type: 'object',
                'x-component': 'Trigger',
                'x-component-props': {
                  onClick: '{{$store.fetch}}',
                  trigEvent: 'onClick',
                },
                properties: {
                  btn: {
                    type: 'object',
                    'x-component': 'Button',
                    'x-component-props': {
                      children: '触发',
                    },
                  },
                },
              },
            },
          },
        },

      }}
  />);

export const TriggerJSX = () => (
  <Space>
    <Trigger
      onClick={() => console.log('click')}
      trigEvent="onClick"
      component="Button"
      children="触发"
    />
    <Trigger
      onClick={() => console.log('click')}
      trigEvent="onClick"
    >
      <Button>触发</Button>
    </Trigger>
  </Space>
);
