import { IAny, IAnyObject, isVacuous, JSONStringify } from '@yimoka/shared';
import React, { isValidElement } from 'react';
import { isValidElementType } from 'react-is';

/**
 * RenderAny 组件的属性接口
 * @interface RenderAnyProps
 * @property {IAny} [value] - 需要渲染的值，可以是任何类型
 * @property {IAnyObject} [props] - 传递给渲染组件的属性
 */
export interface RenderAnyProps {
  value?: IAny
  props?: IAnyObject
}

/**
 * RenderAny 组件 - 用于渲染任意类型的值
 * 支持渲染 React 元素、字符串、组件、布尔值、数字、大整数和对象
 * 对于对象类型，如果包含 default 和 __esModule 属性，则渲染其默认导出
 * 对于空值（null/undefined）返回 null
 * @param {RenderAnyProps} props - 组件属性
 * @returns {React.ReactNode} 渲染结果
 */
export const RenderAny = (props: RenderAnyProps) => {
  const { value, props: cProps } = props;
  const type = typeof value;

  // 如果是 React 元素或字符串，直接返回
  if (isValidElement(value) || type === 'string') {
    return value;
  }

  // 如果是有效的 React 组件类型，则渲染该组件
  if (isValidElementType(value)) {
    const C: IAny = value;
    return <C {...cProps} />;
  }

  // 如果是空值，返回 null
  if (isVacuous(value)) {
    return null;
  }

  // 根据值的类型选择不同的渲染方式
  const typeFnMap: IAnyObject = {
    // 布尔值转换为字符串
    boolean: () => String(value),
    // 数字转换为字符串
    number: () => String(value),
    // 大整数转换为字符串
    bigint: () => String(value),
    // 对象类型：如果是 ES 模块且有默认导出，则渲染默认导出；否则转换为 JSON 字符串
    // eslint-disable-next-line no-underscore-dangle
    object: () => (value.default && value.__esModule ? <RenderAny props={cProps} value={value.default} /> : JSONStringify(value)
    ),
  };
  return typeFnMap[type]?.();
};
