
import { Modal, ModalProps } from '@yimoka/antd';
import { EntityAdd, IEntityAddProps, observer } from '@yimoka/react';
import React from 'react';

import { staffConfig } from './conf';

export const StaffAddPage = observer((props: Omit<IEntityAddProps, 'config' | 'schema' | 'store'>) => (
  <EntityAdd
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
    store={{ options: { filterBlankAtRun: true } }}
  />
));

export const StaffAddModal = (props: Omit<ModalProps, 'children'>) => (
  <Modal
    bindChildStore
    destroyOnHidden
    isRefresh
    maskClosable={false}
    title='添加人员'
    trigger={{ type: 'primary', ghost: true }}
    {...props}
  >
    <StaffAddPage />
  </Modal>
);
