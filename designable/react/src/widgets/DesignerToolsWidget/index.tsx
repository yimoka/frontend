import { CursorType, ScreenType } from '@designable/core';
import { Button, InputNumber } from '@yimoka/antd';
import { observer } from '@yimoka/react';
import cls from 'classnames';
import React, { Fragment, useRef } from 'react';

import {
  useCursor,
  useHistory,
  useScreen,
  usePrefix,
  useWorkbench,
} from '../../hooks';
import { IconWidget } from '../IconWidget';


import './styles.less';

type DesignerToolsType = 'HISTORY' | 'CURSOR' | 'SCREEN_TYPE'

export type IDesignerToolsWidgetProps = {
  className?: string
  style?: React.CSSProperties
  use?: DesignerToolsType[]
}

export const DesignerToolsWidget: React.FC<IDesignerToolsWidgetProps> = observer((props) => {
  const screen = useScreen();
  const cursor = useCursor();
  const workbench = useWorkbench();
  const history = useHistory();
  const sizeRef = useRef<{ width?: any; height?: any }>({});
  const prefix = usePrefix('designer-tools');
  const renderHistoryController = () => {
    if (!props.use.includes('HISTORY')) return null;
    return (
      <Button.Group size="small" style={{ marginRight: 20 }}>
        <Button
          disabled={!history?.allowUndo}
          size="small"
          onClick={() => {
            history.undo();
          }}
        >
          <IconWidget infer="Undo" />
        </Button>
        <Button
          disabled={!history?.allowRedo}
          size="small"
          onClick={() => {
            history.redo();
          }}
        >
          <IconWidget infer="Redo" />
        </Button>
      </Button.Group>
    );
  };

  const renderCursorController = () => {
    if (workbench.type !== 'DESIGNABLE') return null;
    if (!props.use.includes('CURSOR')) return null;
    return (
      <Button.Group size="small" style={{ marginRight: 20 }}>
        <Button
          disabled={cursor.type === CursorType.Move}
          size="small"
          onClick={() => {
            cursor.setType(CursorType.Move);
          }}
        >
          <IconWidget infer="Move" />
        </Button>
        <Button
          disabled={cursor.type === CursorType.Selection}
          size="small"
          onClick={() => {
            cursor.setType(CursorType.Selection);
          }}
        >
          <IconWidget infer="Selection" />
        </Button>
      </Button.Group>
    );
  };

  const renderResponsiveController = () => {
    if (!props.use.includes('SCREEN_TYPE')) return null;
    if (screen.type !== ScreenType.Responsive) return null;
    return (
      <Fragment>
        <InputNumber
          size="small"
          style={{ width: 70, textAlign: 'center' }}
          value={screen.width}
          onChange={(value) => {
            sizeRef.current.width = value;
          }}
          onPressEnter={() => {
            screen.setSize(sizeRef.current.width, screen.height);
          }}
        />
        <IconWidget
          infer="Close"
          size={10}
          style={{ padding: '0 3px', color: '#999' }}
        />
        <InputNumber
          size="small"
          style={{
            width: 70,
            textAlign: 'center',
            marginRight: 10,
          }}
          value={screen.height}
          onChange={(value) => {
            sizeRef.current.height = value;
          }}
          onPressEnter={() => {
            screen.setSize(screen.width, sizeRef.current.height);
          }}
        />
        {(screen.width !== '100%' || screen.height !== '100%') && (
          <Button
            size="small"
            style={{ marginRight: 20 }}
            onClick={() => {
              screen.resetSize();
            }}
          >
            <IconWidget infer="Recover" />
          </Button>
        )}
      </Fragment>
    );
  };

  const renderScreenTypeController = () => {
    if (!props.use.includes('SCREEN_TYPE')) return null;
    return (
      <Button.Group size="small" style={{ marginRight: 20 }}>
        <Button
          disabled={screen.type === ScreenType.PC}
          size="small"
          onClick={() => {
            screen.setType(ScreenType.PC);
          }}
        >
          <IconWidget infer="PC" />
        </Button>
        <Button
          disabled={screen.type === ScreenType.Mobile}
          size="small"
          onClick={() => {
            screen.setType(ScreenType.Mobile);
          }}
        >
          <IconWidget infer="Mobile" />
        </Button>
        <Button
          disabled={screen.type === ScreenType.Responsive}
          size="small"
          onClick={() => {
            screen.setType(ScreenType.Responsive);
          }}
        >
          <IconWidget infer="Responsive" />
        </Button>
      </Button.Group>
    );
  };

  const renderMobileController = () => {
    if (!props.use.includes('SCREEN_TYPE')) return null;
    if (screen.type !== ScreenType.Mobile) return;
    return (
      <Button
        size="small"
        style={{ marginRight: 20 }}
        onClick={() => {
          screen.setFlip(!screen.flip);
        }}
      >
        <IconWidget
          infer="Flip"
          style={{
            transition: 'all .15s ease-in',
            transform: screen.flip ? 'rotate(-90deg)' : '',
          }}
        />
      </Button>
    );
  };

  return (
    <div className={cls(prefix, props.className)} style={props.style}>
      {renderHistoryController()}
      {renderCursorController()}
      {renderScreenTypeController()}
      {renderMobileController()}
      {renderResponsiveController()}
    </div>
  );
});

DesignerToolsWidget.defaultProps = {
  use: ['HISTORY', 'CURSOR', 'SCREEN_TYPE'],
};
