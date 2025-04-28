import { observer } from '@formily/react';
import React from 'react';

import { useLocaleComponent } from '../hooks/use-locale';

import { RecordOperation, RecordOperationProps } from './record-operation';

export const RecordDel = observer((props: Partial<RecordOperationProps>) => {
  const { operation = 'delOne', popconfirm, ...args } = props;
  const locale = useLocaleComponent('RecordDel');

  return (
    <RecordOperation
      operation={operation}
      popconfirm={{
        title: locale.popconfirmTitle,
        description: locale.popconfirmDescription,
        ...(popconfirm === true ? {} : popconfirm),
      }}
      trigger={{ danger: true }}
      {...args}
    />
  );
});
