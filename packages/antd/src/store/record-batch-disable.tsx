import { observer } from '@yimoka/react';
import React, { useMemo } from 'react';

import { useLocaleComponent } from '../hooks/use-locale';

import { RecordBatchOperation, RecordBatchOperationProps } from './record-batch-operation';

export const RecordBatchDisable = observer((props: Partial<RecordBatchOperationProps>) => {
  const { operation = 'disable', popconfirm = true, trigger, ...args } = props;
  const locale = useLocaleComponent('RecordBatchDisable');

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
    <RecordBatchOperation
      operation={operation}
      {...args}
      popconfirm={curPopconfirm}
      trigger={{ danger: true, children: locale.text, ...trigger }}
    />
  );
});
