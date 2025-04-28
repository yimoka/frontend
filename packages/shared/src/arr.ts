import { get } from 'lodash-es';

import { isVacuous } from './val';

/**
 * 将输入值规范化为数组。
 *
 * 如果输入值已经是数组，则按原样返回该值。
 * 如果输入值为空（null、undefined 或空字符串），则返回一个空数组。
 * 否则，返回一个包含输入值的数组。
 *
 * @param value - 要规范化为数组的值
 * @returns 包含输入值的数组，如果输入为空则返回空数组
 * @example
 * ```ts
 * normalizeToArray(1); // [1]
 * normalizeToArray([1, 2]); // [1, 2]
 * normalizeToArray(null); // []
 * normalizeToArray(undefined); // []
 * normalizeToArray(''); // []
 * ```
 */
export const normalizeToArray = <T>(value: T): T extends unknown[] ? T : T[] => {
  if (Array.isArray(value)) {
    return value as T extends unknown[] ? T : T[];
  }
  if (isVacuous(value)) {
    return [] as T extends unknown[] ? T : T[];
  }
  return [value] as T extends unknown[] ? T : T[];
};

/**
 * 将扁平数组转换为树形结构
 *
 * @param array - 要转换的扁平数组
 * @param rootId - 根节点的 ID 值，默认为 0
 * @param keys - 可选的键名配置对象
 * @param keys.id - 节点 ID 的字段名，默认为 'id'
 * @param keys.parentID - 父节点 ID 的字段名，默认为 'parentID'
 * @param keys.children - 子节点数组的字段名，默认为 'children'
 * @returns 转换后的树形结构数组
 * @example
 * ```ts
 * const array = [
 *   { id: 1, parentID: 0, name: '节点1' },
 *   { id: 2, parentID: 1, name: '节点2' },
 *   { id: 3, parentID: 1, name: '节点3' }
 * ];
 * const tree = arrayToTree(array);
 * // 结果：
 * // [
 * //   {
 * //     id: 1,
 * //     parentID: 0,
 * //     name: '节点1',
 * //     children: [
 * //       { id: 2, parentID: 1, name: '节点2' },
 * //       { id: 3, parentID: 1, name: '节点3' }
 * //     ]
 * //   }
 * // ]
 * ```
 */
export function arrayToTree<T extends object = Record<string, unknown>>(
  array: T[],
  rootId: string | number = 0,
  keys?: { id?: string, parentID?: string, children?: string },
) {
  if (!Array.isArray(array)) {
    return [];
  }

  const { id = 'id', parentID = 'parentID', children = 'children' } = keys || {};
  const map = new Map();
  const tree: T[] = [];

  array.forEach((item) => {
    map.set(get(item, id), item);
  });

  array.forEach((item) => {
    const pVal = get(item, parentID);
    if (pVal === rootId) {
      tree.push(item);
    } else {
      const parent = map.get(pVal);
      if (parent) {
        if (!parent[children]) {
          parent[children] = [];
        }
        parent[children].push(item);
      }
    }
  });
  return tree;
}
