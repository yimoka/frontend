import { TreeNode, ITreeNode, WorkbenchTypes } from '@designable/core';
import { requestIdle } from '@designable/shared';
import { observer } from '@yimoka/react';
import React, { useEffect, useState } from 'react';

import { Viewport } from '../containers';
import { useTree, useWorkbench } from '../hooks';


export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    onChange: (tree: ITreeNode) => void
  ) => React.ReactElement
  scrollable?: boolean
  dragTipsDirection?: 'left' | 'right'
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const [visible, setVisible] = useState(true);
  const workbench = useWorkbench();
  const tree = useTree();
  useEffect(() => {
    if (workbench.type === props.type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
    }
  }, [workbench.type]);
  if (workbench.type !== props.type) return null;
  const render = () => props.children(tree, (payload) => {
    tree.from(payload);
    tree.takeSnapshot();
  });
  if (workbench.type === 'DESIGNABLE') return (
    <Viewport dragTipsDirection={props.dragTipsDirection}>
      {render()}
    </Viewport>
  );
  return (
    <div
      style={{
        overflow: props.scrollable ? 'overlay' : 'hidden',
        height: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && render()}
    </div>
  );
});

ViewPanel.defaultProps = {
  scrollable: true,
};
