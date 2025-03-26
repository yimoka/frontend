import { observer } from '@formily/react';
import { Card } from '@yimoka/antd';
import { EntityOperation } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { httpPost } from '@/http';
import { encrypt } from '@/utils/crypt';


const api = async (values: IAnyObject) => {
  const { oldPassword, newPassword, newPasswordConfirm, ...rest } = values;
  const curOldPassword = await encrypt(oldPassword, 'changePassword');
  const curNewPassword = await encrypt(newPassword, 'changePassword');
  return httpPost('/base/iam/portal/password/change', { ...rest, oldPassword: curOldPassword, newPassword: curNewPassword });
};

export const ChangePassword = observer(() => {
  const nav = useNavigate();
  // 获取参数 redirect
  const [searchParams] = useSearchParams();

  const success = () => {
    nav(searchParams.get('redirect') ?? '/', { replace: true });
  };

  return (
    <div style={{
      flex: 'auto',
      background: 'url(https://static-1325426858.cos.ap-guangzhou.myqcloud.com/img/bg3.jpg) no-repeat center center',
      backgroundSize: 'cover',
    }}>
      <Card
        style={{
          width: 390,
          position: 'absolute',
          top: 200,
          right: 200,
          boxShadow: 'rgb(0 0 0 / 15%) 0px 3px 15px',
        }}
      >
        <EntityOperation
          schema={{
            type: 'object',
            properties: {
              form: {
                type: 'void',
                'x-component': 'StoreForm',
                'x-component-props': {
                  labelCol: { span: 5 },
                },
                properties: {
                  title: {
                    type: 'void',
                    'x-component': 'Title',
                    'x-component-props': {
                      children: '修 改 密 码',
                      type: 'warning',
                      level: 3,
                      style: { textAlign: 'center' },
                    },
                  },
                  oldPassword: {
                    title: '密码',
                    required: true,
                    minLength: 8,
                    maxLength: 32,
                    'x-component': 'Input.Password',
                    'x-decorator': 'FormItem',
                  },
                  newPassword: {
                    title: '新密码',
                    required: true,
                    minLength: 8,
                    maxLength: 32,
                    'x-component': 'Input.Password',
                    'x-decorator': 'FormItem',
                  },
                  newPasswordConfirm: {
                    title: '确认密码',
                    required: true,
                    minLength: 8,
                    maxLength: 32,
                    'x-component': 'Input.Password',
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
                          disabled: '{{$self.form.errors.length > 0}}',
                          loading: '{{$store?.loading}}',
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
          store={{
            defaultValues: {
              oldPassword: '',
              newPassword: '',
              newPasswordConfirm: '',
            },
            api,
          }}
          onSuccess={success}>
        </EntityOperation>
      </Card>
    </div >
  );
});

