import { observer, EntityEdit, IEntityEditProps } from '@yimoka/react';
import React from 'react';

import { permissionConfig } from './conf';

export const PermissionEdit = observer((props: Omit<IEntityEditProps, 'config' | 'schema' | 'store'>) => {
  const { ...args } = props;
  return (
    <EntityEdit
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
