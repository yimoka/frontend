import cls from 'classnames';
import React from 'react';

import { usePrefix } from '../../hooks';
export enum ResizeHandleType {
  Resize = 'RESIZE',
  ResizeWidth = 'RESIZE_WIDTH',
  ResizeHeight = 'RESIZE_HEIGHT',
}

export interface IResizeHandleProps {
  type?: ResizeHandleType
}

export const ResizeHandle: React.FC<IResizeHandleProps> = (props) => {
  const prefix = usePrefix('resize-handle');
  return (
    <div
      {...props}
      className={cls(prefix, {
        [`${prefix}-${props.type}`]: !!props.type,
      })}
      data-designer-resize-handle={props.type}
    >
      {props.children}
    </div>
  );
};
