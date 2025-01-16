import { Trigger, TriggerProps, useAdditionalNode } from '@yimoka/react';
import { Drawer as AntDrawer, DrawerProps as AntDrawerProps } from 'antd';
import React, { useState, useEffect, ReactNode } from 'react';

import { Button } from '../base/button';
import { strToIcon } from '../tools/icon';

export type DrawerProps = AntDrawerProps & {
  trigger?: TriggerProps | false
  triggerText?: ReactNode
  onOpen?: TriggerProps['onTrig']
}

export const Drawer = (props: DrawerProps) => {
  const { trigger, triggerText, onOpen, open: oldOpen, title, onClose, closeIcon, extra, footer, ...rest } = props;
  const [open, setOpen] = useState(oldOpen);
  const extraNode = useAdditionalNode('extra', extra);
  const footerNode = useAdditionalNode('footer', footer);
  const titleNode = useAdditionalNode('title', title);

  useEffect(() => {
    setOpen(oldOpen);
  }, [oldOpen]);

  return (
    <>
      {trigger !== false && (
        <Trigger
          component={Button}
          children={triggerText ?? titleNode}
          {...trigger}
          onTrig={(...args) => {
            setOpen(true);
            trigger?.onTrig?.(...args);
            onOpen?.(...args);
          }}
        />
      )}
      <AntDrawer
        {...rest}
        closeIcon={strToIcon(closeIcon)}
        extra={extraNode}
        footer={footerNode}
        title={titleNode}
        open={open}
        onClose={(e) => {
          setOpen(false);
          onClose?.(e);
        }}
      />
    </>
  );
};
