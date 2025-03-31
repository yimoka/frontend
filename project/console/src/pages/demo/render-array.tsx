import { Entity, RenderArray } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const RenderArrayDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema"
items={[
  { key: 'JSX', label: 'JSX 调用', children: <RenderArrayJSX /> },
  { key: 'schema', label: 'Schema', children: <RenderArraySchema /> },
]} />
  </div>
);

const api = () => {
  console.log(' fetch api');
  return { code: 0, msg: '', data: {} };
};

export const RenderArraySchema = () => (
  <Entity
    schema={
      {
        type: 'object',
        properties: {
          divider1: {
            type: 'void',
            'x-component': 'Divider',
            'x-component-props': {
              children: '标准 受按 读取 values 的值',
            },
          },
          arr: {
            type: 'array',
            'x-component': 'RenderArray',
            'x-component-props': {
              data: ['a', 'b', 'c'],
            },
            items: {
              type: 'string',
              'x-component': 'Input',
            },
          },
          divider2: {
            type: 'void',
            'x-component': 'Divider',
            'x-component-props': {
              children: 'data 数据渲染',
            },
          },
          arr2: {
            type: 'void',
            'x-component': 'RenderArray',
            'x-component-props': {
              data: [{ key: 'a', value: '1' }, { key: 'b', value: '2' }, { key: 'c', value: '3' }],
            },
            items: {
              type: 'void',
              'x-component': 'Space',
              properties: {
                key: {
                  type: 'void',
                  'x-component': 'Text',
                  'x-component-props': {
                    children: '{{$record.key}}',
                  },
                },
                value: {
                  type: 'void',
                  'x-component': 'Tag',
                  'x-component-props': {
                    children: '{{$record.value}}',
                  },
                },
              },
            },
          },
          divider3: {
            type: 'void',
            'x-component': 'Divider',
            'x-component-props': {
              children: '不同 item 渲染',
            },
          },
          arr3: {
            type: 'void',
            'x-component': 'RenderArray',
            'x-component-props': {
              data: ['文本', '标签'],
            },
            items: [
              {
                type: 'void',
                'x-component': 'Text',
                'x-component-props': {
                  children: '{{$value}}',
                },
              },
              {
                type: 'void',
                'x-component': 'Tag',
                'x-component-props': {
                  children: '{{$value}}',
                },
              },
            ],
          },
        },
      }}
    store={{ api, defaultValues: { arr: ['a', 'b', 'c'] } }}
  />);

export const RenderArrayJSX = () => (
  <RenderArray />
);
