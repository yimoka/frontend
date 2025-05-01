

import { Modal, ModalProps } from '@yimoka/antd';
import { EntityAdd, IEntityAddProps, observer } from '@yimoka/react';
import React from 'react';

import { privateRoleConfig } from './conf';
export const PrivateRoleAddPage = observer((props: Omit<IEntityAddProps, 'config' | 'schema'>) => (
  <EntityAdd
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

export const PrivateRoleAddModal = (props: Omit<ModalProps, 'children'>) => (
  <Modal
    bindChildStore
    destroyOnClose
    isRefresh
    maskClosable={false}
    title='添加角色'
    trigger={{ type: 'primary', ghost: true }}
    {...props}  >
    <PrivateRoleAddPage />
  </Modal>
);

// export const PrivateRoleBatchAddModal = (props: Omit<ModalProps, 'children'>) => (
//   <Modal isBindContent
//     isBindStore
//     title='批量添加私有角色'
//     trigger={{ children: '批量添加' }}
//     width={1000}
//     {...props}  >
//     <StorePage
//       schema={{
//         type: 'object',
//         properties: {
//           form: {
//             type: 'void',
//             'x-component': 'StoreForm',
//             properties: {
//               data: {
//                 type: 'array',
//                 'x-component': 'JSONEditor',
//               },
//             },
//           },
//         },
//       }}
//       store={{
//         type: 'operate',
//         defaultValues: { data: [] },
//         api: privateRoleConfig.api.batchAdd,
//       }}
//     />
//   </Modal>
// );

