import { useContext } from 'react';

import { TreeNodeContext } from '../context';

export const useTreeNode = () => useContext(TreeNodeContext);
