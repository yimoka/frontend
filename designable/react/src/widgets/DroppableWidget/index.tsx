import { TreeNode } from '@designable/core';
import { observer } from '@yimoka/react';
import React from 'react';

import { useTreeNode, useNodeIdProps } from '../../hooks';
import {
  NodeActionsWidget,
  INodeActionsWidgetActionProps,
} from '../NodeActionsWidget';
import { NodeTitleWidget } from '../NodeTitleWidget';

import './styles.less';

export interface IDroppableWidgetProps {
  node?: TreeNode
  actions?: INodeActionsWidgetActionProps[]
  placeholder?: boolean
  height?: number
  style?: React.CSSProperties
  className?: string
  hasChildren?: boolean
}

export const DroppableWidget: React.FC<IDroppableWidgetProps> = observer(({
  node,
  actions,
  height,
  placeholder,
  style,
  className,
  hasChildren: hasChildrenProp,
  ...props
}) => {
  const currentNode = useTreeNode();
  const nodeId = useNodeIdProps(node);
  const target = node ?? currentNode;
  const hasChildren = hasChildrenProp ?? target.children?.length > 0;
  return (
    <div {...nodeId} className={className} style={style}>
      {hasChildren ? (
        props.children
      ) : placeholder ? (
        <div className="dn-droppable-placeholder" style={{ height }}>
          <NodeTitleWidget node={target} />
        </div>
      ) : (
        props.children
      )}
      {actions?.length ? (
        <NodeActionsWidget>
          {actions.map((action, key) => (
            <NodeActionsWidget.Action {...action} key={key} />
          ))}
        </NodeActionsWidget>
      ) : null}
    </div>
  );
});

DroppableWidget.defaultProps = {
  placeholder: true,
};
