import { observer, EntityAdd, IEntityAddProps } from '@yimoka/react';
import React from 'react';

import { permissionConfig } from './conf';

export const PermissionAdd = observer((props: Omit<IEntityAddProps, 'config' | 'schema' | 'store'>) => {
  const { ...args } = props;
  return (
    <EntityAdd
      {...args}
      config={permissionConfig}
      schema={{
        type: 'object',
        properties: {
          form: {
            type: 'void',
            'x-component': 'StoreForm',
            'x-component-props': {
              labelWidth: 80,
            },
            properties: {
              parentID: {
                $ref: '#/definitions/parentID',
              },
              name: {
                $ref: '#/definitions/name',
              },
              path: {
                $ref: '#/definitions/path',
              },
              icon: {
                $ref: '#/definitions/icon',
              },
              sort: {
                $ref: '#/definitions/sort',
              },
              remark: {
                $ref: '#/definitions/remark',
              },
              isMenu: {
                $ref: '#/definitions/isMenu',
              },
              isPage: {
                $ref: '#/definitions/isPage',
              },
              isAPI: {
                $ref: '#/definitions/isAPI',
              },
            },
          },
        },
      }
      }
      store={{ dictConfig: [{ field: 'parentID', api: permissionConfig.api?.tree }] }}
    />);
});


// export const PermissionBatchAddModal = (props: Omit<ModalProps, 'children'> & { onSuccess?: () => any }) => {
//   const { onSuccess, ...args } = props;
//   return (
//     <Modal title='批量添加权限' width={1000} isBindStore isBindContent trigger={{ children: '批量添加' }} {...args}  >
//       <StorePage
//         store={{
//           type: 'operate',
//           defaultValues: { data: [] },
//           api: permissionConfig.api.batchAdd,
//           runAfter: { runOnSuccess: onSuccess },
//         }}
//         schema={{
//           type: 'object',
//           properties: {
//             form: {
//               type: 'void',
//               'x-component': 'StoreForm',
//               properties: {
//                 data: {
//                   type: 'array',
//                   'x-component': 'JSONEditor',
//                 },
//               },
//             },
//           },
//         }}
//       />
//     </Modal>
//   );
// };
