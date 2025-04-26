

import { Modal, ModalProps } from '@yimoka/antd';
import { EntityDetail, IEntityDetailProps, observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { staffConfig } from './conf';

export const StaffDetailPage = observer((props: Omit<IEntityDetailProps, 'config' | 'schema'>) => (
  <EntityDetail
    {...props}
    config={staffConfig}
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
              switch: { $ref: '#/definitions/__output__switch' },
              realName: { $ref: '#/definitions/__output__realName' },
              phonePrefix: {},
              phone: {},
              mail: {},
              avatar: { $ref: '#/definitions/__output__avatar' },
              isChangePassword: { $ref: '#/definitions/__output__isChangePassword' },
              createTime: { $ref: '#/definitions/__output__createTime' },
              updateTime: { $ref: '#/definitions/__output__updateTime' },
            },
          },
        },
      },
    }}
  />
));

export const StaffDetailModal = (props: Omit<ModalProps, 'children'> & { values?: IAnyObject }) => {
  const { values } = props;
  const record = useExpressionScope()?.$record;

  return (
    <Modal
      destroyOnClose
      footer={false}
      maskClosable={false}
      title='人员详情'
      trigger={{ size: 'small', type: 'primary', ghost: true }}
      {...props}
    >
      <StaffDetailPage values={values ?? record} />
    </Modal>
  );
};

