import { Empty, Tree } from '@yimoka/antd';
import { Entity, EntityResponse, observer, useExpressionScope, useInitStore } from '@yimoka/react';
import React, { useEffect, useMemo } from 'react';

import { permissionConfig } from '../../permission/conf';
import { getHasPermissionsTree, staffConfig } from '../conf';

// eslint-disable-next-line complexity
export const StaffPermission = observer(() => {
  const values = useExpressionScope()?.$record;
  const staffID = values?.id;

  const baseStore = useInitStore({
    defaultValues: { staffID },
    api: staffConfig.api?.getPermissions,
    dictConfig: [{ field: 'paths', api: permissionConfig.api?.tree }],
  });

  const { response, dict } = baseStore;

  useEffect(() => {
    baseStore.setValues({ staffID });
    baseStore.fetch();
  }, [baseStore, staffID]);

  const staffPermissionsTree = useMemo(
    () => getHasPermissionsTree(dict.paths, response?.data?.paths),
    [dict.paths, response?.data?.paths],
  );

  return (
    <Entity store={baseStore}>
      <EntityResponse store={baseStore}>
        {response?.data?.paths?.length > 0
          ? <Tree
            fieldNames={{ title: 'name', key: 'path' }}
            treeData={staffPermissionsTree}
          />
          : <Empty description="暂无权限" />
        }
      </EntityResponse>
    </Entity >
  );
});


