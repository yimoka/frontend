import { observer } from '@formily/react';
import React from 'react';

import { RecordOperation, RecordOperationProps } from './record-operation';

export const RecordDel = observer((props: Partial<RecordOperationProps>) => {
  const { operation = 'delOne', ...args } = props;

  return (
    <RecordOperation
      operation={operation}
      popconfirm={{
        title: '确定删除吗？',
        description: '删除后无法恢复',
      }}
      trigger={{ danger: true }}
      {...args}
    />
  );
});
