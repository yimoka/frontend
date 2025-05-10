import { Modal, StoreTable } from '@yimoka/antd';
import { EntityAdd, EntityList, EntityResponse, observer, useExpressionScope, useInitStore } from '@yimoka/react';
import { IAny, isVacuous } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import React, { useEffect } from 'react';

import { staffConfig, staffsField } from '../../staff/conf';
import { privateRoleConfig } from '../conf';

export const PrivateRoleStaffsModal = observer(() => (
  <Modal
    bindChildStore
    destroyOnHidden
    footer={null}
    title='员工'
    trigger={{ type: 'primary', ghost: true, size: 'small' }}
    width={800}
  >
    <PrivateRoleStaffs />
  </Modal>
));

export const PrivateRoleStaffs = observer(() => {
  const values = useExpressionScope()?.$record;
  const { name: role } = values ?? {};
  const staffsStore = useInitStore({
    fieldsConfig: staffConfig.fieldsConfig,
    type: 'list',
    options: { runNow: 'never', bindRoute: false },
    defaultValues: { role },
    api: privateRoleConfig.api?.getStaffs,
  });
  const { setValues, fetch } = staffsStore;

  useEffect(() => {
    if (!isVacuous(role)) {
      setValues({ role });
      fetch();
    }
  }, [role, fetch, setValues]);

  if (isVacuous(values)) {
    return null;
  }

  return (
    <EntityList
      config={staffConfig}
      store={staffsStore}>
      <EntityResponse store={staffsStore}>
        <Modal
          bindChildStore
          destroyOnHidden
          maskClosable={false}
          title="添加员工"
          trigger={{ size: 'small', type: 'primary', style: { position: 'absolute', right: 50, top: 15 } }}>
          <AddStaff role={role} onSuccess={fetch} />
        </Modal>
        <StoreTable
          bindValue
          columns={[
            { dataIndex: 'id' },
            { dataIndex: 'name' },
            { dataIndex: 'realName' },
            { dataIndex: 'phone' },
            { dataIndex: 'mail' },
            // TODO: 删除员工
            // {
            //   dataIndex: 'id', title: '操作',
            //   // render: (id, record) => (
            //   //   <RowActionDel
            //   //     record={record}
            //   //     store={{
            //   //       defaultValues: { role, staffIDs: [record.id] },
            //   //       api: privateRoleConfig.api.delStaffs,
            //   //     }}
            //   //     onSuccess={() => {
            //   //       runAPI();
            //   //     }}
            //   //   />),
            // },
          ]}
        />
      </EntityResponse>
    </EntityList>
  );
});

const AddStaff = observer(({ role, onSuccess, onStore }: { role: string, onSuccess: () => IAny, onStore?: (store: IStore) => void }) => {
  const addStore = useInitStore({
    fieldsConfig: {
      staffIDs: staffsField,
    },
    defaultValues: { role, staffIDs: [] },
    api: privateRoleConfig.api?.addStaffs,
    afterAtFetch: { successRun: onSuccess },
  });

  return (
    <EntityAdd
      config={{
        fieldsConfig: {
          staffIDs: staffsField,
        },
      }}
      schema={{
        type: 'object',
        properties: {
          form: {
            type: 'void',
            'x-component': 'StoreForm',
            properties: {
              staffIDs: {
                $ref: '#/definitions/staffIDs',
              },
            },
          },
        },
      }}
      store={addStore}
      onStore={onStore}
    />
  );
});
