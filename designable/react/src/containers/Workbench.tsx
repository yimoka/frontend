import { observer } from '@yimoka/react';
import React from 'react';

import { useWorkbench } from '../hooks';

import { Workspace } from './Workspace';

export const Workbench: React.FC = observer((props) => {
  const workbench = useWorkbench();
  return (
    <Workspace id={workbench.currentWorkspace?.id}>{props.children}</Workspace>
  );
});
