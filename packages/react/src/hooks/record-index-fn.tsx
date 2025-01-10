import { IAny } from '@yimoka/shared';
import { useMemo } from 'react';

export const useRecordIndexFn = (dataSource?: readonly IAny[] | IAny[]) => useMemo(() => {
  // 利用闭包 按需生成
  let recordIndexMap: Map<IAny, number>;
  return (record: IAny) => {
    if (!recordIndexMap) {
      recordIndexMap = new Map();
      dataSource?.forEach((item, index: number) => {
        recordIndexMap.set(item, index);
      });
    }
    return recordIndexMap.get(record) ?? 0;
  };
}, [dataSource]);


export type IRecordIndexFn = (record: IAny) => number
