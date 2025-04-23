import { observer } from '@formily/reactive-react';
import cls from 'classnames';
import format from 'dateformat';
import React from 'react';

import { usePrefix, useWorkbench } from '../../hooks';
import { TextWidget } from '../TextWidget';


import './styles.less';

export const HistoryWidget: React.FC = observer(() => {
  const workbench = useWorkbench();
  const currentWorkspace =    workbench?.activeWorkspace || workbench?.currentWorkspace;
  const prefix = usePrefix('history');
  if (!currentWorkspace) return null;
  return (
    <div className={prefix}>
      {currentWorkspace.history.list().map((item, index) => {
        const type = item.type || 'default_state';
        const token = type.replace(/\:/g, '_');
        return (
          <div
            key={item.timestamp}
            className={cls(`${prefix}-item`, {
              active: currentWorkspace.history.current === index,
            })}
            onClick={() => {
              currentWorkspace.history.goTo(index);
            }}
          >
            <span className={`${prefix}-item-title`}>
              <TextWidget token={`operations.${token}`} />
            </span>
            <span className={`${prefix}-item-timestamp`}>
              {' '}
              {format(item.timestamp, 'yy/mm/dd HH:MM:ss')}
            </span>
          </div>
        );
      })}
    </div>
  );
});
