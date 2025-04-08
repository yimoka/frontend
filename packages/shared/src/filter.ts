/**
 * @file filter.ts
 * @module @yimoka/shared
 * @author Yimoka Team
 * @since 1.0.0
 *
 * @summary 表格自动过滤工具函数
 * @description 该模块提供了表格列自动过滤的配置生成功能，支持两种过滤模式：
 * 1. like模式：基于字符串包含关系的模糊匹配
 * 2. enum模式：基于枚举值的精确匹配
 *
 * @category 工具函数
 * @group 表格相关
 */

import { get } from 'lodash-es';

import { IAny } from './type';
import { isBlank } from './val';

/**
 * 自动过滤模式类型定义
 *
 * @type {('like' | 'enum')}
 * @readonly
 * @since 1.0.0
 *
 * @property {string} like - 模糊匹配模式，使用字符串包含关系进行匹配
 * @property {string} enum - 枚举匹配模式，使用精确相等进行匹配
 */
export type IAutoFilter = 'like' | 'enum';

/**
 * 获取表格列的自动过滤配置
 *
 * @summary 生成表格列的过滤配置
 * @description 根据指定的过滤模式和数据源，生成适用于表格列的过滤配置对象
 *
 * @param {IAutoFilter} [autoFilter] - 过滤模式，可选 'like' 或 'enum'
 * @param {IAny[]} [data] - 数据源数组，用于生成过滤选项（enum模式需要）
 * @param {IAny} [path] - 数据路径，用于从记录中获取要过滤的值
 *
 * @returns {Object} 过滤配置对象
 * @property {IAny[]} [filters] - 过滤选项数组，仅enum模式有效
 * @property {Function} [onFilter] - 过滤函数，用于判断记录是否匹配过滤条件
 *
 * @example
 * ```ts
 * // like模式示例
 * const config = getAutoFilterConfig('like', undefined, 'name');
 *
 * // enum模式示例
 * const config = getAutoFilterConfig('enum', users, 'status');
 * ```
 *
 * @remarks
 * - like模式：使用字符串的includes方法进行模糊匹配
 * - enum模式：生成过滤选项列表，使用精确相等进行匹配
 *
 * @since 1.0.0
 */
export const getAutoFilterConfig = (autoFilter?: IAutoFilter, data?: IAny[], path?: IAny) => {
  let filters: IAny[] | undefined;
  let onFilter: undefined | ((value: IAny, record: IAny) => boolean);

  if (autoFilter === 'like' && path) {
    onFilter = (value: IAny, record: IAny) => {
      const rVal = get(record, path);
      if (rVal === value || isBlank(value)) {
        return true;
      }
      if (isBlank(rVal)) {
        return false;
      }
      return rVal?.toString?.().includes?.(value?.toString?.());
    };
  }

  if (autoFilter === 'enum' && path) {
    // 生成过滤选项并去重
    const map = new Map<IAny, IAny>();
    data?.forEach((item) => {
      const rVal = get(item, path);
      const label = rVal?.toString?.() ?? 'undefined';
      map.set(rVal, label);
    });
    filters = Array.from(map.entries()).map(([value, label]) => ({ label, value, text: label }));
    onFilter = (value: IAny, record: IAny) => {
      if (isBlank(value)) {
        return true;
      }
      const rVal = get(record, path);
      return value === rVal;
    };
  }

  return { filters, onFilter };
};
