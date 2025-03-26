import { Tag } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const TagDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema"
items={[
  { key: 'JSX', label: 'JSX 调用', children: <TagJSX /> },
  { key: 'schema', label: 'Schema', children: <TagSchema /> },
]} />
  </div>
);

export const TagSchema = () => (
  <Entity
    schema={{
      type: 'object',
      properties: {
        divider1: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: '标准',
          },
        },
        t1: {
          type: 'void',
          'x-component': 'Tag',
          'x-component-props': {
            children: 'Tag',
          },
        },
        divider2: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: 'Value',
          },
        },
        v1: {
          type: 'string',
          'x-component': 'Tag',
        },
        d3: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: 'CheckableTag',
          },
        },
        checkable: {
          type: 'boolean',
          'x-component': 'CheckableTag',
          'x-component-props': {
            children: 'CheckableTag',
          },
        },
        type: {
          type: 'string',
          'x-component': 'CheckableTag',
          'x-component-props': {
            children: '{{$self.value}}',
            values: { true: 'on', false: 'off' },
          },
        },
      },
    }}
    store={{
      defaultValues: {
        v1: 'v1',
        checkable: true,
        type: 'on',
      },
    }}
  />);

export const TagJSX = () => (
  <>
    <Tag

    />

    <Tag

    />
  </>
);
