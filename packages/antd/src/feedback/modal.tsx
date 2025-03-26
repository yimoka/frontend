import { Trigger, TriggerProps, useAdditionalNode } from '@yimoka/react';
import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import React, { useState, useEffect, ReactNode } from 'react';

import { Button } from '../base/button';
import { strToIcon } from '../tools/icon';

export type ModalProps = AntModalProps & {
  trigger?: TriggerProps | false
  triggerText?: ReactNode
  onOpen?: TriggerProps['onTrig']
  // 触发 onOk 事件时是否关闭
  closeOnOk?: boolean
}

export const Modal = (props: ModalProps) => {
  const { trigger, triggerText, onOpen, open: oldOpen, title, onClose, onCancel, onOk, closeOnOk, closeIcon, cancelText, okText, footer, ...rest } = props;
  const [open, setOpen] = useState(oldOpen);
  const cancelTextNode = useAdditionalNode('cancelText', cancelText);
  const okTextNode = useAdditionalNode('okText', okText);
  const footerNode = useAdditionalNode('footer', footer);
  const titleNode = useAdditionalNode('title', title);

  useEffect(() => {
    setOpen(oldOpen);
  }, [oldOpen]);

  return (
    <>
      {trigger !== false && (
        <Trigger
          children={triggerText ?? titleNode}
          component={Button}
          {...trigger}
          onTrig={(...args) => {
            setOpen(true);
            trigger?.onTrig?.(...args);
            onOpen?.(...args);
          }}
        />
      )}
      <AntModal
        {...rest}
        cancelText={cancelTextNode}
        closeIcon={strToIcon(closeIcon)}
        footer={footerNode}
        okText={okTextNode}
        open={open}
        title={titleNode}
        onCancel={(e) => {
          setOpen(false);
          onCancel?.(e);
        }}
        onClose={(e) => {
          setOpen(false);
          onClose?.(e);
        }}
        onOk={(e) => {
          if (closeOnOk) {
            setOpen(false);
          }
          onOk?.(e);
        }}
      />
    </>
  );
};
