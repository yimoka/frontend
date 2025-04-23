import { TreeNode, GlobalRegistry } from '@designable/core';
import { observer } from '@formily/reactive-react';
import cls from 'classnames';
import React, { Fragment, useEffect } from 'react';

import { TreeNodeContext, DesignerComponentsContext } from '../../context';
import { useTree, usePrefix, useDesigner, useComponents } from '../../hooks';
import { IDesignerComponents } from '../../types';

import './styles.less';

export interface IComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IDesignerComponents
}

export interface ITreeNodeWidgetProps {
  node: TreeNode
  children?: React.ReactChild
}

export const TreeNodeWidget: React.FC<ITreeNodeWidgetProps> = observer((props: ITreeNodeWidgetProps) => {
  const designer = useDesigner(props.node?.designerProps?.effects);
  const components = useComponents();
  const { node } = props;
  const renderChildren = () => {
    if (node?.designerProps?.selfRenderChildren) return [];
    return node?.children?.map(child => <TreeNodeWidget key={child.id} node={child} />);
  };
  const renderProps = (extendsProps: any = {}) => {
    const props = {
      ...node.designerProps?.defaultProps,
      ...extendsProps,
      ...node.props,
      ...node.designerProps?.getComponentProps?.(node),
    };
    if (node.depth === 0) {
      delete props.style;
    }
    return props;
  };
  const renderComponent = () => {
    const { componentName } = node;
    const Component = components[componentName];
    const dataId = {};
    if (Component) {
      if (designer) {
        dataId[designer?.props?.nodeIdAttrName] = node.id;
      }
      return React.createElement(
        Component,
        renderProps(dataId),
        ...renderChildren(),
      );
    }
    if (node?.children?.length) {
      return <Fragment>{renderChildren()}</Fragment>;
    }
  };

  if (!node) return null;
  if (node.hidden) return null;
  return React.createElement(
    TreeNodeContext.Provider,
    { value: node },
    renderComponent(),
  );
});

export const ComponentTreeWidget: React.FC<IComponentTreeWidgetProps> =  observer((props: IComponentTreeWidgetProps) => {
  const tree = useTree();
  const prefix = usePrefix('component-tree');
  const designer = useDesigner();
  const dataId = {};
  if (designer && tree) {
    dataId[designer?.props?.nodeIdAttrName] = tree.id;
  }
  useEffect(() => {
    GlobalRegistry.registerDesignerBehaviors(props.components);
  }, []);
  return (
      <div
        className={cls(prefix, props.className)}
        style={{ ...props.style, ...tree?.props?.style }}
        {...dataId}
      >
        <DesignerComponentsContext.Provider value={props.components}>
          <TreeNodeWidget node={tree} />
        </DesignerComponentsContext.Provider>
      </div>
  );
});

ComponentTreeWidget.displayName = 'ComponentTreeWidget';
