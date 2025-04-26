import { Entity } from '@yimoka/react';
import React from 'react';

import { Text } from '../../base/typography';
import { Descriptions } from '../descriptions';

export const DescriptionsDemo = () => (
  <Entity
    schema={{
      type: 'object',
      properties: {
        userInfo: {
          'x-component': Descriptions,
          type: 'void',
          'x-component-props': {
            title: '用户信息',
            bordered: true,
            dataKey: 'values.userInfo',
          },
          items: {
            type: 'void',
            properties: {
              name: {},
              age: {},
              gender: {},
              address: {},
              phone: {
                'x-component': Text,
                'x-component-props': {
                  withScopeValue: true,
                  copyable: true,
                },
              },
              email: {
                'x-component': 'a',
                'x-component-props': {
                  href: '{{"mailto:"+$record.email}}',
                  target: '_blank',
                  children: '{{$record.email}}',
                },
              },
            },
          },
        },
      },
    }}
    store={{
      fieldsConfig: {
        name: { title: '姓名' },
        age: { title: '年龄' },
        gender: { title: '性别' },
        address: { title: '地址' },
        phone: { title: '电话' },
        email: { title: '邮箱' },
      },
      defaultValues: {
        userInfo: {
          name: '张三',
          age: 28,
          gender: '男',
          address: '北京市朝阳区',
          phone: '13800138000',
          email: 'zhangsan@example.com',
        },
      },
    }}
  />
);
