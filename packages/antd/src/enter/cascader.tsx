/**
 * 级联选择器组件
 * @created 2024-03-21
 * @lastModified 2024-03-21
 * @summary 基于 Ant Design 的级联选择器组件封装，支持字符串和数组两种值类型的输入输出
 * @remarks
 * - 支持自定义分隔符
 * - 支持数据源配置
 * - 支持主题定制
 * - 支持表单验证
 * @example
 * ```tsx
 * <Cascader
 *   value="1,2,3"
 *   valueType="string"
 *   splitter=","
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */

import { observer, PropsWithComponentData, useAdditionalNode, useArrayStringTransform, useComponentData, useSplitter } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Cascader as AntCascader, CascaderProps as AntCascaderProps } from 'antd';
import React from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

/**
 * 级联选择器组件
 * @param {CascaderProps} props - 组件属性
 * @returns {React.ReactElement} 级联选择器组件
 * @throws {Error} 当数据源配置错误时抛出异常
 */
export const Cascader = observer((props: CascaderProps) => {
  const {
    value, valueType, onChange, splitter,
    options, data, store, dataKey,
    multiple, allowClear, suffixIcon, notFoundContent, expandIcon, prefix, removeIcon,
    ...rest } = props;
  // 处理未找到内容的显示
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);
  // 处理前缀显示
  const curPrefix = useAdditionalNode('prefix', prefix);
  // 处理分隔符
  const curSplitter = useSplitter(splitter);
  // 处理值的转换（字符串 <-> 数组）
  const curValue = useArrayStringTransform(value, curSplitter);
  // 处理选项数据源
  const curOptions = useComponentData([options, data], dataKey, store);

  /**
   * 处理值变化
   * @param {CascaderValue} value - 当前选择的值
   * @param {unknown[]} selectedOptions - 选中的选项
   * @returns {void}
   * @summary 根据 valueType 决定输出格式
   * @remarks
   * - string: 将数组值用分隔符连接成字符串
   * - array: 直接输出数组值
   */
  const handleChange: AntCascaderProps['onChange'] = (value, selectedOptions) => {
    if (valueType === 'string') {
      onChange?.(value.join(curSplitter), selectedOptions);
    } else {
      onChange?.(value, selectedOptions);
    }
  };

  return (
    <AntCascader
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      expandIcon={strToIcon(expandIcon)}
      multiple={multiple as IAny}
      notFoundContent={curNotFoundContent}
      options={curOptions}
      prefix={curPrefix}
      removeIcon={strToIcon(removeIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      value={curValue as unknown as CascaderValue}
      onChange={handleChange}
    />
  );
});

/**
 * 级联选择器属性类型
 * @summary 扩展自 antd 的 CascaderProps，增加以下特性
 * @remarks
 * - value: 支持字符串和数组两种类型的值
 * - valueType: 指定值的类型（string/array）
 * - splitter: 字符串值时的分隔符
 * - onChange: 支持字符串和数组两种类型的值输出
 */
export type CascaderProps = PropsWithComponentData<Omit<AntCascaderProps, 'value' | 'onChange'>> & {
  /** 当前选中的值 */
  value?: CascaderValue | string
  /** 值的类型，支持 string 和 array */
  valueType?: 'string' | 'array'
  /** 字符串值时的分隔符 */
  splitter?: string
  /** 值变化时的回调函数 */
  onChange?: (value: CascaderValue | string, selectedOptions: unknown[]) => void
}

type CascaderValue = AntCascaderProps['value']
