import { IAny } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { get } from 'lodash-es';

import { useDeepMemo } from './deep-memo';
import { useStore } from './store';

/**
 * 获取组件的数据 用于低码中的数据兼容处理 为了兼容原有的数据 key 和低码中的默认数据
 * 第一个参数为数据数组，按照数组顺序获取数据，如果数组中的数据为 undefined 则继续获取下一个数据
 * 如果数组中的数据都为 undefined 则根据第二个参数 key 从第三个参数 store 中获取数据
 *
 * @param {IAny[]} dataArray - 数据数组。
 * @param {string} [key] - 可选的键，用于从存储中获取数据。
 * @param {IStore} [store] - 可选的存储对象。
 * @returns {IAny | undefined} 返回找到的数据或存储中的数据，如果都没有则返回 undefined。
 *
 * @example
 * // 示例 1: 从数据数组中获取第一个定义的数据
 * const dataArray = [undefined, { id: 1, name: 'Item 1' }];
 * const data = useComponentData(dataArray);
 * console.log(data); // 输出: { id: 1, name: 'Item 1' }
 *
 * @example
 * // 示例 2: 从存储中获取数据
 * const store = { componentData: { id: 2, name: 'Item 2' } };
 * const data = useComponentData([], 'componentData', store);
 * console.log(data); // 输出: { id: 2, name: 'Item 2' }
 *
 * @example
 * // 示例 3: 数据数组和存储都没有数据
 * const data = useComponentData([]);
 * console.log(data); // 输出: undefined
 */
export const useComponentData = (dataArray: IAny[], key?: string, store?: IStore) => {
  const currentStore = useStore(store);
  return useDeepMemo(() => {
    const data = dataArray.find(item => typeof item !== 'undefined');
    if (data) {
      return data;
    }
    if (currentStore && key) {
      return get(currentStore, key);
    }
    return;
  }, [currentStore, dataArray, key]);
};
