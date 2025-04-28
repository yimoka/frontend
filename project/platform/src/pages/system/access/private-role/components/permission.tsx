
import { Button, Modal } from '@yimoka/antd';
import { EntityEdit, IEntityEditProps, observer, useExpressionScope } from '@yimoka/react';
import { isVacuous } from '@yimoka/shared';
import React from 'react';

import { permissionConfig } from '../../permission/conf';
import { privateRoleConfig } from '../conf';

export const PrivateRolePermission = observer((props: IEntityEditProps) => {
  const { values, ...rest } = props;
  const scope = useExpressionScope();
  const curValues = values ?? scope?.$record;
  const role = curValues?.name;

  if (isVacuous(role)) {
    return null;
  }

  if (role === 'admin') {
    return <Button disabled size='small'>拥有全部权限</Button>;
  }

  return (
    <Modal
      bindChildStore
      destroyOnClose
      title={'权限'}
      trigger={{ type: 'primary', size: 'small' }}
    >
      <EntityEdit
        {...rest}
        config={privateRoleConfig}
        detailStore={{
          defaultValues: { role },
          api: privateRoleConfig.api?.getPermissions,
        }}
        schema={{
          type: 'object',
          properties: {
            form: {
              type: 'void',
              'x-component': 'StoreForm',
              properties: {
                paths: {
                  'x-component': 'Tree',
                  'x-component-props': {
                    checkable: true,
                    noParentKey: true,
                    loading: '{{$store.dictLoading.paths}}',
                    data: '{{$store.dict.paths}}',
                    fieldNames: { title: 'name', key: 'path' },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: { role, paths: [] },
          dictConfig: [{ field: 'paths', api: permissionConfig.api?.tree }],
          api: privateRoleConfig.api?.updatePermissions,
        }}
      />
    </Modal>
  );
});


