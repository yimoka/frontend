import { observer } from '@formily/react';
import { EntityOperation, useInitStore } from '@yimoka/react';
import { IHTTPResponse } from '@yimoka/shared';
import React from 'react';

import { handlePermission } from '@/root';

import { PermissionAdd } from './add';
import { permissionConfig } from './conf';


export const PermissionTreePage = observer(() => {
  const treeStore = useInitStore({
    options: {
      runNow: true,
    },
    api: {
      url: '/base/iam/portal/my/permission',
    },
  });

  const success = (res: IHTTPResponse) => {
    treeStore.fetch();
    handlePermission(res.data);
  };

  return (
    <EntityOperation config={permissionConfig}
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
            trigger: { type: 'primary' },
            title: '新增',
          },
          'x-component': PermissionAdd,
          'x-component-props': {
            success,
          },
        },
      },
    },
  },
}} />
  );
});


