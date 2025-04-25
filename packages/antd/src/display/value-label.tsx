/**
 * 值标签显示组件
 *
 * 用于将值转换为对应的标签显示，支持数组和单值显示，可配置标签样式和颜色
 *
 * @category 展示组件
 */

import { observer } from '@formily/react';
import { RenderAny, useSplitter, withValueFallback } from '@yimoka/react';
import { IAny, IAnyObject, IKeys, IOptions, isVacuous, optionsToObj } from '@yimoka/shared';
import { Tag, Space } from 'antd';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

/**
 * 值标签组件的属性接口
 * @interface ValueLabelProps
 * @property {string | number | Array<string | number>} [value] - 要显示的值，可以是字符串、数字或数组
 * @property {boolean} [toArray] - 是否将字符串值转换为数组
 * @property {IAnyObject | IOptions} [options] - 选项配置，用于映射值到显示文本
 * @property {IKeys} [keys] - 选项的键值映射配置
 * @property {string} [color] - 标签的默认颜色
 * @property {{ [key: string]: string }} [colors] - 不同值对应的颜色映射
 * @property {boolean} [isTag] - 是否以标签形式显示
 * @property {ReactNode} [split] - 数组值之间的分隔符
 * @property {string} [splitter] - 字符串分割符，用于将字符串转换为数组
 */
export interface ValueLabelProps {
  value?: string | number | Array<string | number>,
  toArray?: boolean,
  options?: IAnyObject | IOptions,
  keys?: IKeys,
  color?: string,
  colors?: { [key: string]: string },
  isTag?: boolean
  split?: ReactNode,
  splitter?: string,
}

/**
 * 值标签组件
 *
 * 根据传入的值和配置，将值转换为对应的标签显示
 * 支持单值和数组值的显示，可配置标签样式和颜色
 *
 * @param {ValueLabelProps} props - 组件属性
 * @returns {React.ReactElement | null} 渲染的标签元素或 null
 * @example
 * ```tsx
 * <ValueLabel value="1" options={{ 1: "选项一" }} isTag />
 * <ValueLabel value={["1", "2"]} options={{ 1: "选项一", 2: "选项二" }} />
 * ```
 */
export const ValueLabel = withValueFallback((props: ValueLabelProps) => {
  const { value, toArray, splitter, options, keys } = props;
  const curSplitter = useSplitter(splitter);
  const optMap = useMemo(() => (options ? optionsToObj(options, keys) : {}), [options, keys]);

  const newVal = useMemo(() => {
    if (toArray && typeof value === 'string') {
      return value.split(curSplitter);
    }
    return value;
  }, [toArray, value, curSplitter]);

  if (isVacuous(newVal)) {
    return null;
  }

  if (Array.isArray(newVal)) {
    return <ArrValueLabel {...props} optMap={optMap} value={newVal} />;
  }
  return <StrValueLabel {...props} optMap={optMap} value={newVal} />;
});

/**
 * 单值标签组件
 *
 * 用于显示单个值的标签，支持标签样式和颜色配置
 *
 * @param {StrValueLabelProps} props - 组件属性
 * @returns {React.ReactElement | null} 渲染的标签元素或 null
 */
type StrValueLabelProps = Omit<ValueLabelProps, 'value' | 'options'> & { value: string | number, optMap: IAnyObject };

const StrValueLabel = observer((props: StrValueLabelProps) => {
  const { value, optMap, colors = {}, isTag = false, color = 'blue' } = props;
  const [newColor, setNewColor] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    isTag && setNewColor(String(colors?.[value] ?? color));
  }, [color, colors, isTag, value]);

  useEffect(() => {
    setText(String(optMap?.[value] ?? value ?? ''));
  }, [optMap, value]);

  if (!text) {
    return null;
  }

  if (!isTag) {
    return <RenderAny value={text} />;
  }

  return (<Tag color={newColor}><RenderAny value={text} /></Tag>);
});

/**
 * 数组值标签组件
 *
 * 用于显示数组值的标签组，支持自定义分隔符
 *
 * @param {ArrValueLabelProps} props - 组件属性
 * @returns {React.ReactElement} 渲染的标签组元素
 */
type ArrValueLabelProps = Omit<ValueLabelProps, 'value' | 'options'> & { value: Array<IAny>, optMap: IAnyObject };

const ArrValueLabel = observer((props: ArrValueLabelProps) => {
  const { value, isTag = false, split } = props;
  return (
    <Space wrap split={split ?? isTag ? null : ','}>
      {value.map((val, i) => <StrValueLabel {...props} key={i} value={val} />)}
    </Space >
  );
});

