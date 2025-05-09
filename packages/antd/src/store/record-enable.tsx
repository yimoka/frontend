
import { observer } from '@yimoka/react';
import React, { useMemo } from 'react';

import { useLocaleComponent } from '../hooks/use-locale';

import { RecordOperation, RecordOperationProps } from './record-operation';

export const RecordEnable = observer((props: Partial<RecordOperationProps>) => {
  const { operation = 'enableOne', popconfirm = false, trigger, ...args } = props;
  const locale = useLocaleComponent('RecordEnable');

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
      trigger={{ size: 'small', children: locale.text, ...trigger }}
    />
  );
});
