import { IAny } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { get } from 'lodash-es';

import { useDeepMemo } from './deep-memo';
import { useStore } from './store';

/**
 * 获取组件数据，兼容低码和原有数据。
 *
 * @param {IAny[]} dataSources - 数据数组，按顺序获取第一个定义的数据。
 * @param {string} [storeDataKey] - 可选键，从存储中获取数据。
 * @param {IStore} [store] - 可选 实体数据 store。
 * @returns {IAny | undefined} 返回找到的数据或存储中的数据，若无则返回 undefined。
 *
 * @example
 * // 示例 1: 从数据数组中获取第一个定义的数据
 * const dataSources = [undefined, { id: 1, name: 'Item 1' }];
 * const data = useComponentData(dataSources);
 * console.log(data); // 输出: { id: 1, name: 'Item 1' }
 *
 * @example
 * // 示例 2: 从存储中获取数据
 * const dataStore = { componentData: { id: 2, name: 'Item 2' } };
 * const data = useComponentData([], 'componentData', dataStore);
 * console.log(data); // 输出: { id: 2, name: 'Item 2' }
 *
 * @example
 * // 示例 3: 数据数组和存储都没有数据
 * const data = useComponentData([]);
 * console.log(data); // 输出: undefined
 */
export const useComponentData = (dataSources: IAny[], storeDataKey?: string, store?: IStore | false) => {
  const curStore = useStore(store);
  return useDeepMemo(() => {
    const data = dataSources.find(item => item !== undefined);
    if (data) {
      return data;
    }
    if (curStore && storeDataKey) {
      return get(curStore, storeDataKey);
    }
    return;
  }, [curStore, dataSources, storeDataKey]);
};
