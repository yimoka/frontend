/**
 * @remarks 工具提示相关的工具函数
 * @author ickeep <i@ickeep.com>
 * @module tooltip
 */

import { BaseStore, getFieldConfig, IField, ITooltip } from '@yimoka/store';
import { isValidElement } from 'react';
import { isValidElementType } from 'react-is';

/**
 * 获取字段配置中的工具提示配置
 * @param field - 字段对象
 * @param store - 存储实例
 * @returns 字段的工具提示配置，如果没有则返回 undefined
 */
const getFieldTooltip = (field: IField, store: BaseStore) => {
  const fieldConfig = getFieldConfig(field, store.fieldsConfig);
  const fTooltip = fieldConfig?.['x-tooltip'];
  return fTooltip && fTooltip !== true ? fTooltip : undefined;
};

/**
 * 获取工具提示的内容配置
 * @param tooltip - 工具提示配置
 * @returns 工具提示的内容配置，如果是字符串或 React 元素则返回 { title: tooltip }，否则返回原配置
 */
const getTooltipContent = (tooltip: ITooltip) => {
  if (typeof tooltip === 'string' || isValidElement(tooltip) || isValidElementType(tooltip)) {
    return { title: tooltip };
  }
  return tooltip as Record<string, unknown>;
};

/**
 * 获取工具提示的属性配置
 * @param tooltip - 工具提示配置
 * @param key - 字段对象，可选
 * @param store - 存储实例，可选
 * @returns 工具提示的属性配置，如果 tooltip 为 false 或未定义则返回 undefined
 * @example
 * ```ts
 * const props = getTooltipProps('提示文本');
 * // 返回 { title: '提示文本' }
 *
 * const props = getTooltipProps({ title: '提示文本', placement: 'top' });
 * // 返回 { title: '提示文本', placement: 'top' }
 * ```
 */
export const getTooltipProps = (tooltip?: ITooltip, key?: IField, store?: BaseStore) => {
  if (tooltip === false) {
    return undefined;
  }

  const curTooltip = key && store && (!tooltip || tooltip === true)
    ? getFieldTooltip(key, store)
    : tooltip;

  if (!curTooltip || curTooltip === true) {
    return undefined;
  }

  return getTooltipContent(curTooltip);
};
