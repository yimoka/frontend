import { TreeNode } from '@designable/core';
import cls from 'classnames';
import React from 'react';

import { useDesigner, usePrefix } from '../../hooks';


export interface IResizeHandlerProps {
  node: TreeNode
}

export const ResizeHandler: React.FC<IResizeHandlerProps> = (props) => {
  const designer = useDesigner();
  const prefix = usePrefix('aux-node-resize-handler');
  const createHandler = (value: string) => ({
    [designer.props.nodeResizeHandlerAttrName]: value,
    className: cls(prefix, value),
  });
  const allowResize = props.node.allowResize();
  if (!allowResize) return null;
  const allowX = allowResize.includes('x');
  const allowY = allowResize.includes('y');
  return (
    <>
      {allowX && <div {...createHandler('x-start')}></div>}
      {allowX && <div {...createHandler('x-end')}></div>}
      {allowY && <div {...createHandler('y-start')}></div>}
      {allowY && <div {...createHandler('y-end')}></div>}
    </>
  );
};
