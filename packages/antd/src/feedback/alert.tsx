import { useAdditionalNode } from '@yimoka/react';
import { AlertProps, Alert as AntAlert } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

const AlertFC = (props: AlertProps) => {
  const { action, description, icon, message, ...rest } = props;
  const actionNode = useAdditionalNode('action', action);
  const descriptionNode = useAdditionalNode('description', description);
  const messageNode = useAdditionalNode('message', message);

  return <AntAlert icon={strToIcon(icon)} message={messageNode} description={descriptionNode} action={actionNode} {...rest} />;
};

export const Alert = Object.assign(AlertFC, {
  ErrorBoundary: AntAlert.ErrorBoundary,
});
