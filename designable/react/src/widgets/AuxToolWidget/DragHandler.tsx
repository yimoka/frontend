import { TreeNode } from '@designable/core';
import { Button } from '@yimoka/antd';
import { observer } from '@yimoka/react';

import React from 'react';

import { useDesigner, usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';

export interface IDragHandlerProps {
  node: TreeNode
  style?: React.CSSProperties
}

export const DragHandler: React.FC<IDragHandlerProps> = observer(({ node, style }) => {
  const designer = useDesigner();
  const prefix = usePrefix('aux-drag-handler');
  if (node === node.root || !node.allowDrag()) return null;
  const handlerProps = {
    [designer.props.nodeDragHandlerAttrName]: 'true',
  };
  return (
    <Button {...handlerProps}
      className={prefix}
      style={style}
      type="primary">
      <IconWidget infer="Move" />
    </Button>
  );
});

DragHandler.displayName = 'DragHandler';
