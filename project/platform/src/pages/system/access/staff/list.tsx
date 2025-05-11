import { EntityList, IEntityListProps, observer } from '@yimoka/react';
import React from 'react';

import { StaffAddModal } from './add';
import { StaffPermission } from './components/permission';
import { StaffRole } from './components/role';
import { staffConfig } from './conf';
import { StaffDetailModal } from './detail';
import { StaffEditModal } from './edit';

export const StaffListPage = observer((props: Omit<IEntityListProps, 'config' | 'schema' | 'store'>) => (
  <EntityList
    {...props}
    components={{
      StaffAddModal,
      StaffDetailModal,
      StaffEditModal,
      StaffRole,
      StaffPermission,
    }}
    config={staffConfig}
    schema={{
      type: 'object',
      properties: {
        header: {
          type: 'void',
          'x-decorator': 'PageHeader',
          'x-component': 'Space',
          properties: {
            add: { type: 'void', 'x-component': 'StaffAddModal' },
            batchAdd: { type: 'void', 'x-component': 'EntityBatchAddModal' },
          },
        },
        listFilter: {
          type: 'void',
          'x-component': 'ListFilter',
          properties: {
            id: { $ref: '#/definitions/id' },
            nameLike: { $ref: '#/definitions/nameLike' },
          },
        },
        divider: {
          type: 'void',
          'x-component': 'Divider',
        },
        batch: {
          type: 'void',
          'x-decorator': 'Flex',
          'x-decorator-props': { justify: 'end', style: { marginBottom: 12 } },
          'x-component': 'Space',
          properties: {
            enable: { type: 'void', 'x-component': 'RecordBatchEnable' },
            disable: { type: 'void', 'x-component': 'RecordBatchDisable' },
            del: { type: 'void', 'x-component': 'RecordBatchDel' },
          },
        },
        res: {
          type: 'void',
          'x-component': 'EntityResponse',
          properties: {
            listData: {
              type: 'void',
              // 当使用表达式时 可使用 ReFormByListData 强制表格重新渲染
              // 'x-decorator': 'ReFormByListData',
              'x-component': 'StoreTable',
              'x-component-props': {
                rowKey: 'id',
                rowSelection: { fixed: true },
                scroll: { x: 'max-content' },
              },
              items: {
                type: 'object',
                properties: {
                  id: {},
                  name: {},
                  switch: { $ref: '#/definitions/__output__switch' },
                  realName: {},
                  phonePrefix: {},
                  phone: {},
                  mail: {},
                  isChangePassword: { $ref: '#/definitions/__output__isChangePassword' },
                  createTime: { $ref: '#/definitions/__output__createTime' },
                  updateTime: { $ref: '#/definitions/__output__updateTime' },
                  operation: {
                    type: 'void',
                    'x-decorator': 'Column',
                    'x-decorator-props': { title: '操作', fixed: 'right', width: 380 },
                    'x-component': 'Space',
                    properties: {
                      role: {
                        type: 'void',
                        'x-decorator': 'Modal',
                        'x-decorator-props': {
                          title: '角色',
                          bindChildStore: true,
                          destroyOnHidden: true,
                          trigger: { type: 'primary', size: 'small' },
                        },
                        'x-component': 'StaffRole',
                      },
                      permission: {
                        type: 'void',
                        'x-decorator': 'Modal',
                        'x-decorator-props': {
                          title: '查看权限',
                          footer: false,
                          destroyOnHidden: true,
                          trigger: { size: 'small' },
                        },
                        properties: {
                          name: {
                            type: 'void',
                            'x-component': 'StaffPermission',
                          },
                        },
                      },
                      detail: {
                        type: 'void',
                        'x-component': 'StaffDetailModal',
                        'x-component-props': { title: '详情' },
                      },
                      edit: {
                        type: 'void',
                        'x-component': 'StaffEditModal',
                        'x-component-props': { title: '编辑' },
                      },
                      switch: {
                        type: 'void',
                        'x-component': 'RecordSwitch',
                      },
                      delete: {
                        type: 'void',
                        'x-component': 'RecordDel',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }}
  />
));

