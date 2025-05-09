import { observer, useExpressionScope } from '@yimoka/react';
import { getSmart, IAnyObject } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { RecordDisable } from './record-disable';
import { RecordEnable } from './record-enable';
import { RecordOperationProps } from './record-operation';

export type RecordSwitchProps = {
  switchKey?: string;
  disable?: RecordOperationProps;
  enable?: RecordOperationProps;
  record?: IAnyObject;
}

export const RecordSwitch = observer((props: RecordSwitchProps) => {
  const { switchKey = 'switch', disable, enable, record } = props;
  const { $record } = useExpressionScope() ?? {};
  const curRecord = useMemo(() => record ?? $record, [record, $record]);
  const curSwitch = useMemo(() => getSmart(curRecord, switchKey), [curRecord, switchKey]);

  if (curSwitch) {
    return <RecordDisable {...disable} />;
  }
  return <RecordEnable {...enable} />;
});
