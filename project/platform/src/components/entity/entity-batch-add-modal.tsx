import { Modal, ModalProps } from '@yimoka/antd';
import { EntityBatchAdd, IEntityAddProps } from '@yimoka/react';
import React from 'react';

export interface EntityBatchAddModalProps extends IEntityAddProps {
  modal: ModalProps;
}

export const EntityBatchAddModal = (props: EntityBatchAddModalProps) => {
  const { modal, ...rest } = props;
  return (
    <Modal
      bindChildStore
      destroyOnHidden
      isRefresh
      maskClosable={false}
      title='批量添加'
      {...modal}>
      <EntityBatchAdd {...rest} />
    </Modal>
  );
};
