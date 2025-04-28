import { TreeNode } from '@designable/core';
import { Button } from '@yimoka/antd';
import React from 'react';

import { useOperation, usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';


export interface IDeleteProps {
  node: TreeNode
  style?: React.CSSProperties
}

export const Delete: React.FC<IDeleteProps> = ({ node, style }) => {
  const operation = useOperation();
  const prefix = usePrefix('aux-copy');
  if (node === node.root) return null;
  return (
    <Button
      className={prefix}
      style={style}
      type="primary"
      onClick={() => {
        operation.removeNodes([node]);
      }}
    >
      <IconWidget infer="Remove" />
    </Button>
  );
};

Delete.displayName = 'Delete';
