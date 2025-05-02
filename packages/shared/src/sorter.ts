import dayjs from 'dayjs';

import { normalizeToArray } from './arr';
import { IToNumberOption, toNumber } from './num';
import { IAny, IKey, IObjKey } from './type';
import { getSmart } from './val';

/**
 * 获取排序函数
 * @param autoSorter - 自动排序配置
 * @returns 返回对应的排序函数
 * @remarks
 * 根据不同的排序类型返回相应的排序函数：
 * - 自定义函数：直接返回该函数
 * - 布尔值：直接返回该值
 * - 数字排序：使用toNumber转换后比较
 * - 字符串排序：使用localeCompare比较
 * - 百分比排序：去除%后比较数字
 * - 日期排序：使用dayjs比较日期
 * - 时间排序：使用dayjs比较时间
 * - 长度排序：比较字符串或数组长度
 */
export const getSorterFn = (config: IAutoSorter, path?: IKey | IKey[] | IObjKey | IObjKey[]) => {
  const { autoSorter } = config;
  if (typeof autoSorter === 'function') {
    return autoSorter;
  }

  if (autoSorter === 'number') {
    return (a: IAny, b: IAny) => toNumber(getSmart(a, path), config.sorterParams) - toNumber(getSmart(b, path), config.sorterParams);
  }

  if (autoSorter === 'string') {
    return (a: IAny, b: IAny) => {
      const params = config.sorterParams;
      return getSmart(a, path)?.localeCompare(getSmart(b, path), ...(normalizeToArray(params)));
    };
  }
  if (autoSorter === 'percentage') {
    return (a: IAny, b: IAny) => {
      const aValue = getSmart(a, path);
      const bValue = getSmart(b, path);
      const aNum = typeof aValue === 'string' ? Number(aValue.replace('%', '')) : aValue;
      const bNum = typeof bValue === 'string' ? Number(bValue.replace('%', '')) : bValue;
      return aNum - bNum;
    };
  }
  if (autoSorter === 'date') {
    return (a: IAny, b: IAny) => {
      const aDate = dayjs(getSmart(a, path));
      const bDate = dayjs(getSmart(b, path));
      return aDate.isBefore(bDate) ? -1 : 1;
    };
  }
  if (autoSorter === 'time') {
    return (a: IAny, b: IAny) => {
      const aTime = dayjs(`2022-01-01 ${getSmart(a, path)}`);
      const bTime = dayjs(`2022-01-01 ${getSmart(b, path)}`);
      return aTime.isBefore(bTime) ? -1 : 1;
    };
  }
  if (autoSorter === 'length') {
    return (a: IAny, b: IAny) => {
      const aLength = typeof a === 'string' ? a.length : getSmart(a, path)?.length;
      const bLength = typeof b === 'string' ? b.length : getSmart(b, path)?.length;
      return aLength - bLength;
    };
  }
  return;
};

/**
 * 自动排序配置项类型定义
 * @remarks
 * 支持多种排序方式：
 * 1. 百分比排序
 * 2. 日期排序
 * 3. 时间排序
 * 4. 长度排序
 * 5. 字符串排序（支持中文）
 * 6. 数字排序
 * 7. 自定义排序函数
 */
export type IAutoSorter = {
  key?: string;
  dataIndex?: string | string[];
} & (({
  /** 自动排序类型或自定义排序函数 */
  autoSorter?: 'percentage' | 'date' | 'time' | 'length' | ((...args: IAny[]) => IAny)
}) | ({
  /** 字符串排序类型 */
  autoSorter?: 'string',
  /** 字符串排序参数，支持中文排序或自定义排序规则 */
  sorterParams?: 'zh' | 'string' | IAny[],
}) | ({
  /** 数字排序类型 */
  autoSorter?: 'number',
  /** 数字转换选项 */
  sorterParams?: IToNumberOption;
}));
