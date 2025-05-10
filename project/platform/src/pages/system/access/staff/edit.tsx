
import { Modal, ModalProps } from '@yimoka/antd';
import { EntityEdit, IEntityEditProps, observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { staffConfig } from './conf';

export const StaffEditPage = observer((props: Omit<IEntityEditProps, 'config' | 'schema' | 'store'>) => (
  <EntityEdit
    {...props}
    config={staffConfig}
    omitKeys={['phone', 'mail', 'password']}
    schema={{
      type: 'object',
      properties: {
        form: {
          type: 'void',
          'x-component': 'StoreForm',
          'x-component-props': {
            labelWidth: 60,
          },
          properties: {
            name: {
              $ref: '#/definitions/name',
            },
            switch: {
              $ref: '#/definitions/switch',
            },
            realName: {
              $ref: '#/definitions/realName',
            },
            phonePrefix: {
              $ref: '#/definitions/phonePrefix',
            },
            phone: {
              $ref: '#/definitions/phone',
              'x-component-props': {
                placeholder: '手机已加密，不显示原值，留空则不修改',
              },
            },
            mail: {
              $ref: '#/definitions/mail',
              'x-component-props': {
                placeholder: '邮箱已加密，不显示原值，留空则不修改',
              },
            },
            avatar: {
              $ref: '#/definitions/avatar',
            },
            password: {
              $ref: '#/definitions/password',
              'x-component-props': {
                placeholder: '密码已加密，不显示原值，留空则不修改',
              },
            },
            isChangePassword: {
              $ref: '#/definitions/isChangePassword',
            },
          },
        },
      },
    }}
    store={{
      options: {
        filterBlankAtRun: ['phone', 'mail', 'password'],
      },
    }}
  />
));

export const StaffEditModal = (props: Omit<ModalProps, 'children'> & { values?: IAnyObject }) => {
  const { values } = props;
  const record = useExpressionScope()?.$record;

  return (
    <Modal
      bindChildStore
      destroyOnHidden
      isRefresh
      maskClosable={false}
      title='编辑人员'
      trigger={{ type: 'primary', size: 'small', ghost: true }}
      {...props}
    >
      <StaffEditPage values={values ?? record} />
    </Modal>
  );
};
