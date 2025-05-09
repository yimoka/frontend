import { observer } from '@yimoka/react';
import React, { useMemo } from 'react';

import { useLocaleComponent } from '../hooks/use-locale';

import { RecordOperation, RecordOperationProps } from './record-operation';

export const RecordDisable = observer((props: Partial<RecordOperationProps>) => {
  const { operation = 'disableOne', popconfirm = true, trigger, ...args } = props;
  const locale = useLocaleComponent('RecordDisable');

  const curPopconfirm = useMemo(() => {
    const defaultPopconfirm = {
      title: locale.popconfirmTitle,
    };
    if (popconfirm === true) {
      return defaultPopconfirm;
    }
    if (popconfirm === false) {
      return undefined;
    }
    return { ...defaultPopconfirm, ...popconfirm };
  }, [locale, popconfirm]);

  return (
    <RecordOperation
      operation={operation}
      {...args}
      popconfirm={curPopconfirm}
      trigger={{ danger: true, size: 'small', children: locale.text, ...trigger }}
    />
  );
});
