import React from 'react';

import { Simulator } from '../containers';

import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel';
export const ViewportPanel: React.FC<IWorkspaceItemProps> = props => (
    <WorkspacePanel.Item {...props} flexable>
      <Simulator>{props.children}</Simulator>
    </WorkspacePanel.Item>
);
