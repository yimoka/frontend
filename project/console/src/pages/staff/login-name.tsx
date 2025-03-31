import { observer } from '@formily/react';
import { EntityOperation, IEntityProps } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { httpPost } from '@/http';
import { setTenantID } from '@/local';
import { encrypt } from '@/utils/crypt';

const loginAPI = async (values: IAnyObject) => {
  const { password, tenantID, ...rest } = values;
  setTenantID(tenantID);
  const curPassword = await encrypt(password, 'login');
  return httpPost('/admin/tenant/bff/login', { ...rest, password: curPassword });
};

export const StaffLoginByName = observer((props: Omit<IEntityProps, 'store' | 'schema'>) => (
  <EntityOperation
    {...props}
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
            // 租户
            tenantID: {
              title: '租户',
              required: true,
              'x-component': 'Input',
              'x-decorator': 'FormItem',
            },
            name: {
              title: '用户名',
              required: true,
              minLength: 6,
              maxLength: 32,
              'x-component': 'Input',
              'x-decorator': 'FormItem',
            },
            password: {
              title: '密码',
              required: true,
              minLength: 8,
              maxLength: 32,
              'x-component': 'Input.Password',
              'x-decorator': 'FormItem',
            },
            code: {
              type: 'void',
              'x-component': 'Row',
              'x-component-props': { gutter: 20 },
              'x-hidden': '{{ !$self.form.values.needCaptcha }}',
              properties: {
                c1: {
                  type: 'void',
                  'x-component': 'Col',
                  'x-component-props': { span: 16 },
                  properties: {
                    captchaCode: {
                      'x-component': 'Input',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': { labelCol: { span: 6 } },
                      'x-validator': { len: 4 },
                      title: '验证码',
                    },
                  },
                },
                c2: {
                  type: 'void',
                  'x-component': 'Col',
                  'x-component-props': { span: 8 },
                  properties: {
                    captchaID: {
                      'x-component': 'ImageCaptcha',
                    },
                  },
                },
              },
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
                    disabled: '{{$self.form.errors.length > 0}}',
                    loading: '{{$store?.loading}}',
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
    store={{
      options: {
        filterBlankAtRun: true,
      },
      defaultValues: {
        name: '',
        password: '',
        needCaptcha: false,
        captchaID: '',
        captchaCode: '',
        tenantID: '',
      },
      api: loginAPI,
      afterAtFetch: {
        failRun: (res, store) => {
          if (res?.metadata?.needCaptcha) {
            store.setFieldValue('needCaptcha', res?.metadata?.needCaptcha);
          }
        },
      },
    }}>
  </EntityOperation>
));
