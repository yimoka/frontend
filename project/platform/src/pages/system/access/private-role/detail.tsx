import { Modal, ModalProps } from '@yimoka/antd';
import { EntityDetail, IEntityDetailProps, observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { privateRoleConfig } from './conf';

export const PrivateRoleDetailPage = observer((props: Omit<IEntityDetailProps, 'config' | 'schema'>) => (
  <EntityDetail
    {...props}
    config={privateRoleConfig}
    schema={{
      type: 'object',
      properties: {
        desc: {
          type: 'void',
          'x-component': 'Descriptions',
          'x-component-props': {
            column: 1,
            data: '{{$store.values}}',
            styles: { label: { width: 60 } },
          },
          items: {
            type: 'void',
            properties: {
              id: {},
              name: {},
              showName: {},
              remark: {},
              createTime: { $ref: '#/definitions/__output__createTime' },
              updateTime: { $ref: '#/definitions/__output__updateTime' },
            },
          },
        },
      },
    }}
  />
));

export const PrivateRoleDetailModal = (props: Omit<ModalProps, 'children'> & { values?: IAnyObject }) => {
  const { values } = props;
  const record = useExpressionScope()?.$record;

  return (
    <Modal
      destroyOnHidden
      footer={false}
      maskClosable={false}
      title='角色详情'
      trigger={{ size: 'small', type: 'primary', ghost: true }}
      {...props}  >
      <PrivateRoleDetailPage values={values ?? record} />
    </Modal>
  );
};

