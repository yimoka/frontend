import { EntityOperation, IEntityProps } from '@yimoka/react';
import React from 'react';

import { loginMail } from './api';

export const LoginByMail = (props: Omit<IEntityProps, 'store' | 'schema'>) => (
  <EntityOperation
    {...props}
    store={{ defaultValues: { mail: '', code: '' }, api: loginMail }}
    schema={{
      type: 'object',
      properties: {
        form: {
          type: 'void',
          'x-component': 'StoreForm',
          'x-component-props': {
            labelCol: { span: 4 },
          },
          properties: {
            title: {
              type: 'void',
              'x-component': 'Title',
              'x-component-props': {
                children: '登 录 账 号',
                type: 'warning',
                level: 3,
                style: { textAlign: 'center' },
              },
            },
            mail: {
              title: '邮箱',
              required: true,
              'x-validator': { format: 'email' },
              'x-component': 'MailCaptcha',
              'x-decorator': 'FormItem',
            },
            code: {
              title: '验证码',
              required: true,
              'x-validator': { len: 6 },
              'x-component': 'Input',
              'x-decorator': 'FormItem',
            },
            btn: {
              type: 'void',
              'x-decorator': 'div',
              'x-decorator-props': {
                style: { textAlign: 'center' },
              },
              'x-component': 'Space',
              properties: {
                reset: {
                  'x-component': 'Reset',
                  'x-component-props': { children: '重置' },
                },
                submit: {
                  type: 'void',
                  'x-component': 'Submit',
                  'x-component-props': {
                    style: { margin: 'auto' },
                    children: '登录',
                  },
                },
              },
            },
            text: {
              type: 'void',
              'x-component': 'Text',
              'x-component-props': {
                children: '登录视为您已同意第三方账号绑定协议、服务条款、隐私政策',
                style: { textAlign: 'center', marginTop: 20, display: 'block' },
                type: 'secondary',
                size: 'small',
              },
            },
          },
        },
      },
    }}
  />
);
