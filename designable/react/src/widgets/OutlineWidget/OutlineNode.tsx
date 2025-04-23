import {
  TreeNode,
  ClosestPosition,
  CursorStatus,
  DragMoveEvent,
} from '@designable/core';
import { isFn } from '@designable/shared';
import { autorun } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import cls from 'classnames';
import React, { useRef, useContext, useEffect } from 'react';

import {
  usePrefix,
  useCursor,
  useSelection,
  useOutlineDragon,
  useDesigner,
} from '../../hooks';
import { IconWidget } from '../IconWidget';
import { NodeTitleWidget } from '../NodeTitleWidget';

import { NodeContext } from './context';


import './styles.less';
export interface IOutlineTreeNodeProps {
  node: TreeNode
  style?: React.CSSProperties
  className?: string
  workspaceId?: string
}

export const OutlineTreeNode: React.FC<IOutlineTreeNodeProps> = observer(({ node, className, style, workspaceId }) => {
  const prefix = usePrefix('outline-tree-node');
  const engine = useDesigner();
  const ref = useRef<HTMLDivElement>();
  const ctx = useContext(NodeContext);
  const request = useRef(null);
  const cursor = useCursor();
  const selection = useSelection(workspaceId);
  const outlineDragon = useOutlineDragon(workspaceId);

  useEffect(() => engine.subscribeTo(DragMoveEvent, () => {
    const closestNodeId = outlineDragon?.closestNode?.id;
    const closestDirection = outlineDragon?.closestDirection;
    const { id } = node;
    if (!ref.current) return;
    if (
      closestNodeId === id
          && closestDirection === ClosestPosition.Inner
    ) {
      if (!ref.current.classList.contains('droppable')) {
        ref.current.classList.add('droppable');
      }
      if (!ref.current.classList.contains('expanded')) {
        if (request.current) {
          clearTimeout(request.current);
          request.current = null;
        }
        request.current = setTimeout(() => {
          ref.current.classList.add('expanded');
        }, 600);
      }
    } else {
      if (request.current) {
        clearTimeout(request.current);
        request.current = null;
      }
      if (ref.current.classList.contains('droppable')) {
        ref.current.classList.remove('droppable');
      }
    }
  }), [node, outlineDragon, cursor]);

  useEffect(() => autorun(() => {
    const selectedIds = selection?.selected || [];
    const { id } = node;
    if (!ref.current) return;
    if (selectedIds.includes(id)) {
      if (!ref.current.classList.contains('selected')) {
        ref.current.classList.add('selected');
      }
    } else {
      if (ref.current.classList.contains('selected')) {
        ref.current.classList.remove('selected');
      }
    }
    if (
      cursor.status === CursorStatus.Dragging
          && outlineDragon?.dragNodes?.length
    ) {
      if (ref.current.classList.contains('selected')) {
        ref.current.classList.remove('selected');
      }
    }
  }), [node, selection, outlineDragon]);

  if (!node) return null;

  const renderIcon = (node: TreeNode) => {
    const { icon } = node.designerProps;
    if (icon) {
      return <IconWidget infer={icon} size={12} />;
    }
    if (node === node?.root) {
      return <IconWidget infer="Page" size={12} />;
    } if (node.designerProps?.droppable) {
      return <IconWidget infer="Container" size={12} />;
    }
    return <IconWidget infer="Component" size={12} />;
  };

  const renderTitle = (node: TreeNode) => {
    if (isFn(ctx.renderTitle)) return ctx.renderTitle(node);
    return (
        <span>
          <NodeTitleWidget node={node} />
        </span>
    );
  };

  const renderActions = (node: TreeNode) => {
    if (isFn(ctx.renderActions)) return ctx.renderActions(node);
  };

  return (
      <div
        ref={ref}
        className={cls(prefix, className, 'expanded')}
        data-designer-outline-node-id={node.id}
        style={style}
      >
        <div className={`${prefix}-header`}>
          <div
            className={`${prefix}-header-head`}
            style={{
              left: -node.depth * 16,
              width: node.depth * 16,
            }}
          ></div>
          <div className={`${prefix}-header-content`}>
            <div className={`${prefix}-header-base`}>
              {(node?.children?.length > 0 || node === node.root) && (
                <div
                  className={`${prefix}-expand`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (ref.current?.classList?.contains('expanded')) {
                      ref.current?.classList.remove('expanded');
                    } else {
                      ref.current?.classList.add('expanded');
                    }
                  }}
                >
                  <IconWidget infer="Expand" size={10} />
                </div>
              )}
              <div className={`${prefix}-icon`}>{renderIcon(node)}</div>
              <div className={`${prefix}-title`}>{renderTitle(node)}</div>
            </div>
            <div
              data-click-stop-propagation
              className={`${prefix}-header-actions`}
            >
              {renderActions(node)}
              {node !== node.root && (
                <IconWidget
                  className={cls(`${prefix}-hidden-icon`, {
                    hidden: node.hidden,
                  })}
                  infer={node.hidden ? 'EyeClose' : 'Eye'}
                  size={14}
                  onClick={() => {
                    node.hidden = !node.hidden;
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={`${prefix}-children`}>
          {node.children?.map(child => (
              <OutlineTreeNode
                key={child.id}
                node={child}
                workspaceId={workspaceId}
              />
          ))}
        </div>
      </div>
  );
});
