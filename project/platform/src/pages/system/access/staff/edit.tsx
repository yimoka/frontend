
import { Modal, ModalProps } from '@yimoka/antd';
import { EntityEdit, IEntityEditProps, observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { staffConfig } from './conf';

export const StaffEditPage = observer((props: Omit<IEntityEditProps, 'config' | 'schema' | 'store'>) => (
  <EntityEdit
    {...props}
    config={staffConfig}
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
            },
            mail: {
              $ref: '#/definitions/mail',
            },
            avatar: {
              $ref: '#/definitions/avatar',
            },
            isChangePassword: {
              $ref: '#/definitions/isChangePassword',
            },
            password: {
              $ref: '#/definitions/password',
            },
          },
        },
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
      destroyOnClose
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
