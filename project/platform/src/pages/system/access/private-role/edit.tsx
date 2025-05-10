

import { Modal, ModalProps } from '@yimoka/antd';
import { EntityEdit, IEntityEditProps, observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { privateRoleConfig } from './conf';
export const PrivateRoleEditPage = observer((props: Omit<IEntityEditProps, 'config' | 'schema'>) => (
  <EntityEdit
    {...props}
    config={privateRoleConfig}
    schema={{
      type: 'object',
      properties: {
        form: {
          type: 'void',
          'x-component': 'StoreForm',
          'x-component-props': {
            labelWidth: 60,
            // fields: ['name', 'showName', 'remark'],
          },
          properties: {
            name: {
              $ref: '#/definitions/name',
            },
            showName: {
              $ref: '#/definitions/showName',
            },
            remark: {
              $ref: '#/definitions/remark',
            },
          },
        },
      },
    }}
  />
));

export const PrivateRoleEditModal = (props: Omit<ModalProps, 'children'> & { values?: IAnyObject }) => {
  const { values } = props;
  const record = useExpressionScope()?.$record;

  return (
    <Modal
      bindChildStore
      destroyOnHidden
      isRefresh
      maskClosable={false}
      title='编辑角色'
      trigger={{ size: 'small', type: 'primary', ghost: true }}
      {...props}  >
      <PrivateRoleEditPage values={values ?? record} />
    </Modal>
  );
};

