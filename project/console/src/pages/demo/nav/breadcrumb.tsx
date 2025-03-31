import { Breadcrumb } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const BreadcrumbDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema"
items={[
  { key: 'JSX', label: 'JSX 调用', children: <BreadcrumbJSX /> },
  { key: 'schema', label: 'Schema', children: <BreadcrumbSchema /> },
]} />
  </div>
);

export const BreadcrumbSchema = () => (
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
        breadcrumb1: {
          type: 'void',
          'x-component': 'Breadcrumb',
          'x-component-props': {
            // 数据源与 json schema 的 items 结合
            data: ['tag', '22'],
            itemRender: 'link',
            items: [
              { title: 'Home' },
              { title: '列表', path: 'list' },
            ],
          },
          items: [
            {
              type: 'void',
              title: '详情',
              'x-component': 'Item',
              'x-component-props': {
                path: 'detail',
              },
              properties: {
                tag: {
                  type: 'void',
                  'x-component': 'Tag',
                  'x-component-props': {
                    color: 'green',
                    children: '详情',
                  },
                },
              },
            },
            {
              type: 'void',
              'x-component': 'Item',
            },
          ],
        },
        divider2: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: 'data + JSON Schema items',
          },
        },
        data: {
          type: 'array',
          'x-component': 'Breadcrumb',
          'x-component-props': {
            // data: [{ title: 'Home', path: '/' }, { title: '列表', path: 'list' }],
          },
          items: {
            type: 'object',
            'x-component': 'Link',
            'x-component-props': {
              to: '{{ $record.path }}',
            },
            properties: {
              title: {
                type: 'string',
                'x-component': 'Tag',
                'x-component-props': {
                  color: 'green',
                  // 可通过指定 children 来指定显示的内容 Tag 本身也做了 value 的支持
                  // children: '{{ $record.title }}',
                },
              },
            },
          },
        },
      },
    }}
    store={{
      defaultValues: {
        name: 'name',
        data: [{ title: 'Home', path: '/' }, { title: '列表', path: 'list' }],
      },
    }}
  />);

export const BreadcrumbJSX = () => (
  <>
    <Breadcrumb

    />

    <Breadcrumb

    />
  </>
);
