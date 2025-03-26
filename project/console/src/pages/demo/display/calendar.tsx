import { Calendar } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const CalendarDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema"
items={[
  { key: 'JSX', label: 'JSX 调用', children: <CalendarJSX /> },
  { key: 'schema', label: 'Schema', children: <CalendarSchema /> },
]} />
  </div>
);

const change = console.log;

export const CalendarSchema = () => (
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
        c1: {
          type: 'void',
          'x-component': 'Calendar',
          'x-component-props': {
            children: 'Calendar',
            defaultValue: '2022-01-01',
            valueType: 'string',
            format: 'YYYY-MM-DD',
            onChange: change,
          },
        },
        divider2: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: '时间戳 + 受控',
          },
        },
        timestamp: {
          type: 'number',
          'x-component': 'Calendar',
          'x-component-props': {
            children: 'Calendar',
            valueType: 'ms',
            onChange: change,
            validRange: 'lastMonth',
          },
        },
        divider3: {
          type: 'void',
          'x-component': 'Divider',
          'x-component-props': {
            children: '默认值',
          },
        },
        c3: {
          type: 'string',
          default: '{{new Date().getTime()}}',
          'x-component': 'Calendar',
          'x-component-props': {
            children: 'Calendar',
            valueType: 'string',
            format: 'YYYY-MM-DD',
            onChange: change,
          },
        },
        btn: {
          type: 'void',
          'x-component': 'Button',
          'x-component-props': {
            children: '设置默认值',
            onClick: '{{()=>console.log($store.values)}}',
          },
        },
      },
    }}
    store={{
      defaultValues: {
        timestamp: 1640995200000,
        c3: undefined,
      },
    }}
  />);

export const CalendarJSX = () => (
  <>
    <Calendar />
  </>
);
