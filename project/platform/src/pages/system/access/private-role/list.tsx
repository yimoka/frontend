import { EntityList, IEntityListProps, observer } from '@yimoka/react';

import React from 'react';

// import { PrivateRoleAddModal, PrivateRoleBatchAddModal } from './add';
// import { PrivateRolePermission } from './components/permission';
// import { PrivateRoleStaffsModal } from './components/staffs';
import { PrivateRoleAddModal } from './add';
import { PrivateRolePermission } from './components/permission';
import { PrivateRoleStaffsModal } from './components/staffs';
import { privateRoleConfig } from './conf';
import { PrivateRoleDetailModal } from './detail';
import { PrivateRoleEditModal } from './edit';

export const PrivateRoleListPage = observer((props: Omit<IEntityListProps, 'config' | 'schema' | 'store'>) => (
  <EntityList
    {...props}
    components={{
      PrivateRoleAddModal,
      PrivateRoleEditModal,
      PrivateRoleDetailModal,
      PrivateRolePermission,
      PrivateRoleStaffsModal,
      // PrivateRolePermission, PrivateRoleStaffsModal, PrivateRoleAddModal, PrivateRoleBatchAddModal, PrivateRoleEditModal, PrivateRoleDetailModal
    }}
    config={privateRoleConfig}
    schema={{
      type: 'object',
      properties: {
        header: {
          type: 'void',
          'x-decorator': 'PageHeader',
          'x-component': 'Space',
          properties: {
            add: { 'x-component': 'PrivateRoleAddModal' },
            // add: { 'x-component': 'AddLink' },
            // batchAdd: { 'x-component': 'PrivateRoleBatchAddModal' },
          },
        },
        listFilter: {
          type: 'void',
          'x-component': 'ListFilter',
          'x-component-props': {
            col: { span: 12, xxl: 7 },
            actionCol: { span: 12, xxl: 2 },
          },
          properties: {
            id: { $ref: '#/definitions/id' },
            nameLike: { $ref: '#/definitions/nameLike' },
            showNameLike: { $ref: '#/definitions/showNameLike' },
          },
        },
        divider: {
          type: 'void',
          'x-component': 'Divider',
        },
        // batchBar: {
        //   type: 'void',
        //   'x-component': 'BatchBarAction',
        //   'x-component-props': {
        //     isEnable: false,
        //     isDisabled: false,
        //   },
        // },
        listData: {
          type: 'void',
          'x-decorator': 'EntityResponse',
          'x-component': 'StoreTable',
          'x-component-props': {
            rowKey: 'id',
            rowSelection: { fixed: true },
            scroll: { x: 'max-content' },
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
              operation: {
                type: 'void',
                'x-decorator': 'Column',
                'x-decorator-props': { title: '操作', fixed: 'right', width: 250 },
                'x-component': 'Space',
                properties: {
                  permission: {
                    type: 'void',
                    'x-component': 'PrivateRolePermission',
                  },
                  staffs: {
                    type: 'void',
                    'x-component': 'PrivateRoleStaffsModal',
                  },
                  edit: {
                    'x-component': 'PrivateRoleEditModal',
                    'x-component-props': { title: '编辑' },
                  },

                  // delete: {
                  //   type: 'void',
                  //   'x-component': 'RowActionDel',
                  // },
                },
              },
            },
          },
        },
      },
    }}
  />
));

