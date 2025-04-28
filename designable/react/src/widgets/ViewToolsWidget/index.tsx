import { WorkbenchTypes } from '@designable/core';
import { Button } from '@yimoka/antd';
import { observer } from '@yimoka/react';
import cls from 'classnames';
import React from 'react';

import { usePrefix, useWorkbench } from '../../hooks';
import { IconWidget } from '../IconWidget';


export interface IViewToolsWidget {
  use?: WorkbenchTypes[]
  style?: React.CSSProperties
  className?: string
}

export const ViewToolsWidget: React.FC<IViewToolsWidget> = observer(({ use, style, className }) => {
  const workbench = useWorkbench();
  const prefix = usePrefix('view-tools');
  return (
    <Button.Group className={cls(prefix, className)} style={style}>
      {use?.includes('DESIGNABLE') && (
        <Button
          disabled={workbench.type === 'DESIGNABLE'}
          size="small"
          onClick={() => {
            workbench.type = 'DESIGNABLE';
          }}
        >
          <IconWidget infer="Design" />
        </Button>
      )}
      {use?.includes('JSONTREE') && (
        <Button
          disabled={workbench.type === 'JSONTREE'}
          size="small"
          onClick={() => {
            workbench.type = 'JSONTREE';
          }}
        >
          <IconWidget infer="JSON" />
        </Button>
      )}
      {use?.includes('MARKUP') && (
        <Button
          disabled={workbench.type === 'MARKUP'}
          size="small"
          onClick={() => {
            workbench.type = 'MARKUP';
          }}
        >
          <IconWidget infer="Code" />
        </Button>
      )}
      {use?.includes('PREVIEW') && (
        <Button
          disabled={workbench.type === 'PREVIEW'}
          size="small"
          onClick={() => {
            workbench.type = 'PREVIEW';
          }}
        >
          <IconWidget infer="Play" />
        </Button>
      )}
    </Button.Group>
  );
});

ViewToolsWidget.defaultProps = {
  use: ['DESIGNABLE', 'JSONTREE', 'PREVIEW'],
};
