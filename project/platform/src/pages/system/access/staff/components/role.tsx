
import { EntityEdit, IEntityEditProps, observer, useExpressionScope } from '@yimoka/react';
import { IAny, isVacuous } from '@yimoka/shared';

import React from 'react';

import { privateRoleConfig } from '../../private-role/conf';
import { staffConfig } from '../conf';

// 处理树数据 辅助项不可选
const handleData = (data: IAny) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item.name !== 'private') {
        return item;
      }
      return { ...item, disableCheckbox: true };
    });
  }
  return data;
};

// 表格中使用 需要自行获取 record
export const StaffRole = observer((props: IEntityEditProps) => {
  const record = useExpressionScope()?.$record;
  const staffID = record?.id;

  if (isVacuous(staffID)) {
    return null;
  };

  return (
    <EntityEdit
      {...props}
      detailStore={{ defaultValues: { staffID }, api: staffConfig.api?.getRoles }}
      schema={{
        type: 'object',
        properties: {
          form: {
            type: 'void',
            'x-component': 'StoreForm',
            properties: {
              roles: {
                type: 'string',
                'x-component': 'Tree',
                'x-component-props': {
                  checkable: true,
                  data: '{{handleData($store.dict.roles)}}',
                  isValueHasParent: true,
                  checkStrictly: true,
                  defaultExpandedKeys: ['private'],
                  fieldNames: { title: 'showName', key: 'name' },
                },
              },
            },
          },
        },
      }}
      scope={{ handleData }}
      store={{
        defaultValues: { staffID, roles: [] },
        api: staffConfig.api?.updateRoles,
        dictConfig: [{ field: 'roles', api: { ...privateRoleConfig.api?.tenantRoleTree } }],
      }}
    />
  );
});
