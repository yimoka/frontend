import { TreeNode, Engine } from '@designable/core';
import { createContext } from 'react';

import {
  IDesignerLayoutContext,
  IWorkspaceContext,
  IDesignerComponents,
} from './types';

export const DesignerComponentsContext = createContext<IDesignerComponents>({});

export const DesignerLayoutContext = createContext<IDesignerLayoutContext>(null);

export const DesignerEngineContext = createContext<Engine>(null);

export const TreeNodeContext = createContext<TreeNode>(null);

export const WorkspaceContext = createContext<IWorkspaceContext>(null);
