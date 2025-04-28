/**
 * ECharts React 组件
 * @created 2024-03-21
 * @lastModified 2024-03-21
 * @category Components
 * @group Charts
 * @summary 基于 ECharts 的 React 封装组件，支持自动调整大小和动态数据更新
 * @remarks
 * 该组件封装了 ECharts 的核心功能，提供了以下特性：
 * 1. 自动响应容器大小变化
 * 2. 支持动态数据更新
 * 3. 支持自定义配置
 * 4. 支持图表实例回调
 *
 * @example
 * ```tsx
 * import { Echarts } from '@yimoka/echarts';
 *
 * const App = () => {
 *   const options = {
 *     xAxis: {
 *       type: 'category',
 *       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
 *     },
 *     yAxis: {
 *       type: 'value'
 *     },
 *     series: [{
 *       data: [150, 230, 224, 218, 135, 147, 260],
 *       type: 'line'
 *     }]
 *   };
 *
 *   return <Echarts options={options} />;
 * };
 * ```
 */

import { IAny, isVacuous } from '@yimoka/shared';
import * as echarts from 'echarts';
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ECharts 组件属性接口
 * @interface EchartsContentProps
 * @extends HTMLAttributes<HTMLDivElement>
 * @property {echarts.EChartsOption} [options] - ECharts 配置项
 * @property {(chart: echarts.ECharts) => void} [onChart] - 图表实例创建后的回调函数
 * @property {boolean} [autoSize] - 是否自动调整大小，默认为 true
 * @property {IAny[]} [value] - 兼容低码平台的数据输入
 * @property {IAny[]} [data] - 兼容低码平台的数据输入
 */
export interface EchartsContentProps extends HTMLAttributes<HTMLDivElement> {
  options?: echarts.EChartsOption;
  onChart?: (chart: echarts.ECharts) => void;
  autoSize?: boolean;
  value?: IAny[];
  data?: IAny[];
}

/**
 * ECharts React 组件
 * @param {EchartsContentProps} props - 组件属性
 * @returns {JSX.Element} ECharts 图表组件
 * @throws {Error} 当容器元素不存在时抛出错误
 */
export const Echarts = (props: EchartsContentProps) => {
  const { options, onChart, value, data, autoSize = true, ...rest } = props;
  const [myChart, setMyChart] = useState<echarts.ECharts | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  /**
   * 处理数据源和配置项
   * @returns {echarts.EChartsOption | undefined} 处理后的配置项
   */
  const curOptions = useMemo(() => {
    const curData = data ?? value;
    if (isVacuous(curData) || isVacuous(options)) {
      return options;
    }
    const { dataset, ...restOptions } = options;
    if (isVacuous(dataset)) {
      return {
        ...restOptions,
        dataset: {
          source: curData,
        },
      };
    }
    if (Array.isArray(dataset)) {
      return options;
    }

    if (typeof dataset.source === 'undefined') {
      return {
        ...restOptions,
        dataset: {
          ...dataset,
          source: curData,
        },
      };
    }
    return options;
  }, [data, value, options]);

  // 初始化图表
  useEffect(() => {
    if (ref.current) {
      const chart = echarts.init(ref.current);
      setMyChart(chart);

      // 清理函数
      return () => {
        chart.dispose();
      };
    }
  }, []);

  // 处理图表实例变化
  useEffect(() => {
    if (onChart && myChart) {
      onChart(myChart);
    }
  }, [myChart, onChart]);

  // 处理自动调整大小
  useEffect(() => {
    const cleanupObserver = () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
        resizeObserver.current = null;
      }
    };

    if (!myChart || !ref.current || !autoSize) {
      cleanupObserver();
      return;
    }

    // 如果已经有 observer，不需要重新创建
    if (resizeObserver.current) {
      return;
    }

    // 创建新的 observer
    const observer = new ResizeObserver(() => {
      myChart.resize();
    });
    observer.observe(ref.current);
    resizeObserver.current = observer;

    // 清理函数
    return cleanupObserver;
  }, [myChart, autoSize]);

  // 更新图表配置
  useEffect(() => {
    if (myChart && curOptions) {
      myChart.setOption(curOptions);
    }
  }, [myChart, curOptions]);

  return <div ref={ref}
    role="region"
    style={{ minHeight: 400 }}
    {...rest} />;
};
