/**
 * @description 提供用于获取数据源中记录索引的 Hook 函数
 */

import { IAny } from '@yimoka/shared';
import { useMemo } from 'react';

/**
 * 生成记录索引查找函数
 * @summary 通过闭包缓存数据源索引映射，提供高效的记录索引查找功能
 * @param dataSource - 数据源数组，可以是只读数组或普通数组
 * @returns 返回一个函数，该函数接收记录作为参数，返回该记录在数据源中的索引
 * @example
 * ```tsx
 * const item = { id: 1 };
 * const data = [item, { id: 2 }];
 * const getIndex = useRecordIndexFn(data);
 * const index = getIndex(item); // 返回 0
 * ```
 */
export const useRecordIndexFn = (dataSource?: readonly IAny[] | IAny[]) => useMemo(() => {
  // 利用闭包缓存索引映射，避免重复计算
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

/**
 * 记录索引函数类型定义
 * @type {(record: IAny) => number}
 * @description 接收一个记录作为参数，返回该记录在数据源中的索引位置
 */
export type IRecordIndexFn = (record: IAny) => number
