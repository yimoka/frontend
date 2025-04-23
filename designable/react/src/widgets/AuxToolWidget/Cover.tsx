import { CursorStatus, ClosestPosition, TreeNode } from '@designable/core';
import { observer } from '@yimoka/react';
import cls from 'classnames';
import React, { Fragment } from 'react';

import {
  useViewport,
  useDragon,
  useCursor,
  useValidNodeOffsetRect,
  usePrefix,
} from '../../hooks';
interface ICoverRectProps {
  node: TreeNode
  dragging?: boolean
  dropping?: boolean
}

const CoverRect: React.FC<ICoverRectProps> = (props) => {
  const prefix = usePrefix('aux-cover-rect');
  const rect = useValidNodeOffsetRect(props.node);
  const createCoverStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none',
    };
    if (rect) {
      baseStyle.transform = `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`;
      baseStyle.height = rect.height;
      baseStyle.width = rect.width;
    }
    return baseStyle;
  };

  return (
    <div
      className={cls(prefix, {
        dragging: props.dragging,
        dropping: props.dropping,
      })}
      style={createCoverStyle()}
    ></div>
  );
};

export const Cover = observer(() => {
  const viewportDragon = useDragon();
  const viewport = useViewport();
  const cursor = useCursor();
  const renderDropCover = () => {
    if (
      !viewportDragon.closestNode?.allowAppend(viewportDragon.dragNodes)
      || viewportDragon.closestDirection !== ClosestPosition.Inner
    ) return null;
    return <CoverRect dropping node={viewportDragon.closestNode} />;
  };
  if (cursor.status !== CursorStatus.Dragging) return null;

  return (
    <Fragment>
      {viewportDragon.dragNodes.map((node) => {
        if (!node) return;
        if (!viewport.findElementById(node.id)) return;
        return <CoverRect key={node.id} dragging node={node} />;
      })}
      {renderDropCover()}
    </Fragment>
  );
});

Cover.displayName = 'Cover';
