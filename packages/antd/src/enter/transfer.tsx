import { PropsWithComponentData, useComponentData, useSplitter, useStore } from '@yimoka/react';
import { strToArr } from '@yimoka/shared';
import { Transfer as AntTransfer, TransferProps as AntTransferProps } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

export const Transfer = (props: TransferProps) => {
  const {
    store, data, dataKey, dataSource, targetKeys,
    splitter, value, valueType, onChange,
    selectionsIcon,
    ...rest
  } = props;
  const curStore = useStore(store);
  const curData = useComponentData([dataSource, data], dataKey, curStore);
  const curSplitter = useSplitter(splitter);

  const curValue = useMemo(() => {
    if (targetKeys) {
      return targetKeys;
    }
    if (typeof value === 'string') {
      return strToArr(value, curSplitter);
    }
    return value;
  }, [targetKeys, value, curSplitter]);

  const handleChange: AntTransferProps['onChange'] = (targetKeys, direction, moveKeys) => {
    if (valueType === 'string' && Array.isArray(value)) {
      onChange?.(value.join(curSplitter), direction, moveKeys);
    } else {
      onChange?.(targetKeys, direction, moveKeys);
    }
  };

  return (
    <AntTransfer
      {...rest}
      dataSource={curData}
      selectionsIcon={strToIcon(selectionsIcon)}
      targetKeys={curValue}
      onChange={handleChange}
    />
  );
};

export type TransferProps = PropsWithComponentData<Omit<AntTransferProps, 'onChange'>> & {
  splitter?: string
  valueType?: 'string' | 'array'
  onChange?: (targetKeys: string | React.Key[], direction: TransferDirection, moveKeys: React.Key[]) => void
  value?: string | React.Key[]
}
