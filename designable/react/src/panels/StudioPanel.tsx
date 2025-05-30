import cls from 'classnames';
import React, { useContext } from 'react';

import { Layout } from '../containers';
import { usePrefix, usePosition } from '../hooks';
export interface IStudioPanelProps {
  style?: React.CSSProperties
  className?: string
  logo?: React.ReactNode
  actions?: React.ReactNode
  prefixCls?: string
  theme?: string
  position?: React.ComponentProps<typeof Layout>['position']
}

const StudioPanelInternal: React.FC<IStudioPanelProps> = ({
  logo,
  actions,
  ...props
}) => {
  const prefix = usePrefix('main-panel');
  const position = usePosition();
  const classNameBase = cls('root', position, props.className);
  if (logo || actions) {
    return (
      <div
        {...props}
        className={cls(`${prefix}-container`, classNameBase)}
      >
        <div className={`${prefix}-header`}>
          <div className={`${prefix}-header-logo`}>{logo}</div>
          <div className={`${prefix}-header-actions`}>{actions}</div>
        </div>
        <div className={prefix}>{props.children}</div>
      </div>
    );
  }
  return (
    <div {...props} className={cls(prefix, classNameBase)}>
      {props.children}
    </div>
  );
};

export const StudioPanel: React.FC<IStudioPanelProps> = props => (
    <Layout
      position={props.position}
      prefixCls={props.prefixCls}
      theme={props.theme}
    >
      <StudioPanelInternal {...props} />
    </Layout>
);
