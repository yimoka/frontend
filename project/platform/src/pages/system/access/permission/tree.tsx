import { observer } from '@formily/react';
import { Dropdown, Icon, Modal, RecordDel, Space } from '@yimoka/antd';
import { EntityOperation, useInitStore } from '@yimoka/react';
import { IHTTPResponse, isBlank, isSuccess } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import React from 'react';

import { handlePermission, IPermissionTreeItem } from '@/root';

import { PermissionAdd } from './add';
import { permissionConfig } from './conf';
import { PermissionEdit } from './edit';

export const PermissionTreePage = observer(() => {
  const treeStore = useInitStore({
    options: { runNow: true },
    api: { url: '/base/iam/portal/my/permission' },
  });

  const success = (_res?: IHTTPResponse, isUpdate?: boolean) => {
    treeStore.fetch().then((res) => {
      if (isUpdate && isSuccess(res) && Array.isArray(res.data)) {
        handlePermission(res.data);
      }
    });
  };

  return (
    <EntityOperation
      config={permissionConfig}
      schema={{
        type: 'object',
        properties: {
          header: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              add: {
                type: 'void',
                'x-decorator': 'Modal',
                'x-decorator-props': {
                  bindChildStore: true,
                  trigger: { type: 'primary' },
                  title: '新增',
                },
                'x-component': PermissionAdd,
                'x-component-props': {
                  onSuccess: success,
                },
              },
            },
          },
          res: {
            type: 'void',
            'x-component': 'EntityResponse',
            properties: {
              data: {
                type: 'void',
                'x-decorator': 'Loading',
                'x-decorator-props': {
                  loading: '{{$store.loading}}',
                },
                'x-component': 'Tree',
                'x-component-props': {
                  fieldNames: { key: 'id', title: 'name' },
                  data: '{{$store.response.data}}',
                  titleRender: (node: IPermissionTreeItem) => <TitleRender node={node} treeStore={treeStore} onSuccess={success} />,
                },
              },
            },
          },
        },
      }}
      store={treeStore}
    />
  );
});


const TitleRender = observer(({ node, onSuccess, treeStore }: { node: IPermissionTreeItem, onSuccess: () => void, treeStore: IStore }) => (
  <Space>
    {node.icon && <Icon name={node.icon} />}
    <span>{node.name}</span>
    <Dropdown
      destroyPopupOnHide={false}
      menu={{
        items: [
          {
            key: 'edit',
            label: (
              <Modal bindChildStore title="编辑权限" trigger={{ component: 'Text', children: '编辑' }} >
                <PermissionEdit values={node} onSuccess={onSuccess} />
              </Modal>
            ),
          },
          {
            key: 'add',
            label: (
              <Modal bindChildStore title="添加权限" trigger={{ component: 'Text', children: '添加' }} >
                <PermissionAdd defaultValues={{ parentID: node.id }} onSuccess={onSuccess} />
              </Modal>
            ),
          },
          {
            key: 'del',
            disabled: !isBlank(node.children),
            label: (
              <RecordDel
                isRefresh
                parentStore={treeStore}
                record={node}
                trigger={{ component: 'Text', type: 'danger', disabled: !isBlank(node.children), children: '删除' }} />
            ),
          },
        ],
      }}
    >
      <span>
        <Icon name='EllipsisOutlined' />
      </span>
    </Dropdown>
  </Space>
));
