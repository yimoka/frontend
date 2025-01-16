import { Breadcrumb } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const BreadcrumbDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <BreadcrumbJSX /> },
      { key: 'schema', label: 'Schema', children: <BreadcrumbSchema /> },
    ]} />
  </div>
);

export const BreadcrumbSchema = () => (
  <Entity
    store={{
      defaultValues: {
        name: 'name',
      },
    }}
    schema={{
      type: 'object',
      properties: {
        breadcrumb: {
          type: 'void',
          'x-component': 'Breadcrumb',
          'x-component-props': {
            itemRender: 'link',
            items: [
              { title: 'Home' },
              { title: 'List', path: '/list' },
              { title: 'App' },
            ],
          },
        },
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
