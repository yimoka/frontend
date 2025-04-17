import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Echarts } from '../echarts';

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn().mockReturnValue({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  }),
}));

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {
    // 立即触发回调
    this.callback([], this);
  }
  unobserve() { }
  disconnect() { }
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

describe('Echarts 组件', () => {
  const mockOptions: echarts.EChartsOption = {
    xAxis: {
      type: 'category' as const,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line' as const,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 创建 MockResizeObserver 的 spy
    vi.spyOn(window, 'ResizeObserver').mockImplementation(callback => new MockResizeObserver(callback));
  });

  it('应该正确渲染组件', () => {
    render(<Echarts options={mockOptions} />);
    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle({ minHeight: '400px' });
  });

  it('应该初始化 ECharts 实例', () => {
    render(<Echarts options={mockOptions} />);
    expect(echarts.init).toHaveBeenCalled();
  });

  it('应该设置图表配置', () => {
    const chartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
    };
    (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

    render(<Echarts options={mockOptions} />);
    expect(chartInstance.setOption).toHaveBeenCalledWith(mockOptions);
  });

  it('应该调用 onChart 回调', () => {
    const onChart = vi.fn();
    const chartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
    };
    (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

    render(<Echarts options={mockOptions} onChart={onChart} />);
    expect(onChart).toHaveBeenCalledWith(chartInstance);
  });

  describe('数据源处理', () => {
    it('应该处理空数据源', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      render(<Echarts data={undefined} options={mockOptions} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith(mockOptions);
    });

    it('应该处理空配置项', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      render(<Echarts data={[1, 2, 3]} />);
      expect(chartInstance.setOption).not.toHaveBeenCalled();
    });

    it('应该处理数组类型的 dataset', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const optionsWithArrayDataset = {
        ...mockOptions,
        dataset: [{
          source: [1, 2, 3],
        }],
      };

      render(<Echarts data={[4, 5, 6]} options={optionsWithArrayDataset} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith(optionsWithArrayDataset);
    });

    it('应该处理已有 dataset 但无 source 的情况', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const optionsWithDataset = {
        ...mockOptions,
        dataset: {
          dimensions: ['x', 'y'],
        },
      };

      const data = [1, 2, 3];
      render(<Echarts data={data} options={optionsWithDataset} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith({
        ...mockOptions,
        dataset: {
          dimensions: ['x', 'y'],
          source: data,
        },
      });
    });

    it('应该处理 value 属性', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const value = [7, 8, 9];
      render(<Echarts options={mockOptions} value={value} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith({
        ...mockOptions,
        dataset: {
          source: value,
        },
      });
    });

    it('应该优先使用 data 属性而不是 value 属性', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const data = [1, 2, 3];
      const value = [7, 8, 9];
      render(<Echarts data={data} options={mockOptions} value={value} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith({
        ...mockOptions,
        dataset: {
          source: data,
        },
      });
    });

    it('应该处理已有 dataset 和 source 的情况', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const optionsWithDatasetAndSource = {
        ...mockOptions,
        dataset: {
          source: [1, 2, 3],
        },
      };

      render(<Echarts data={[4, 5, 6]} options={optionsWithDatasetAndSource} />);
      expect(chartInstance.setOption).toHaveBeenCalledWith(optionsWithDatasetAndSource);
    });
  });

  describe('自动调整大小', () => {
    it('应该在 autoSize 为 true 时创建新的 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { rerender } = render(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalled();

      // 重新渲染不应该创建新的 observer
      rerender(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);
    });

    it('应该在 autoSize 为 false 时清理 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { rerender } = render(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalled();

      // 切换到 false 应该清理 observer
      rerender(<Echarts autoSize={false} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);
    });

    it('应该在组件卸载时清理 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { unmount } = render(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalled();

      unmount();
      // ResizeObserver 应该被清理
      expect(chartInstance.dispose).toHaveBeenCalled();
    });

    it('应该在没有图表实例时不创建 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { container } = render(<Echarts autoSize={true} options={mockOptions} />);
      container.remove(); // 移除容器元素
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);
    });

    it('应该在没有容器元素时不创建 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { unmount } = render(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);
      unmount();
    });

    it('应该在 autoSize 为 false 时不创建 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      render(<Echarts autoSize={false} options={mockOptions} />);
      expect(chartInstance.resize).not.toHaveBeenCalled();
    });

    it('应该在切换 autoSize 时正确处理 ResizeObserver', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { rerender } = render(<Echarts autoSize={false} options={mockOptions} />);
      expect(chartInstance.resize).not.toHaveBeenCalled();

      // 切换到 true 应该创建新的 observer
      rerender(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);

      // 切换回 false 应该清理 observer
      rerender(<Echarts autoSize={false} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalledTimes(1);
    });

    it('应该在组件卸载时清理所有资源', () => {
      const chartInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
      };
      (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

      const { unmount } = render(<Echarts autoSize={true} options={mockOptions} />);
      expect(chartInstance.resize).toHaveBeenCalled();

      // 模拟组件卸载
      unmount();

      // 应该清理 ResizeObserver 和图表实例
      expect(chartInstance.dispose).toHaveBeenCalled();
    });
  });

  it('应该在卸载时清理资源', () => {
    const chartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
    };
    (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

    const { unmount } = render(<Echarts options={mockOptions} />);
    unmount();

    expect(chartInstance.dispose).toHaveBeenCalled();
  });

  it('应该在没有图表实例时不更新配置', () => {
    const chartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
    };
    (echarts.init as ReturnType<typeof vi.fn>).mockReturnValue(chartInstance);

    const { rerender } = render(<Echarts options={undefined} />);
    expect(chartInstance.setOption).not.toHaveBeenCalled();

    rerender(<Echarts options={mockOptions} />);
    expect(chartInstance.setOption).toHaveBeenCalledWith(mockOptions);
  });

  it('不应重复创建 ResizeObserver', async () => {
    const options: EChartsOption = {
      series: [{
        type: 'line' as const,
        data: [1, 2, 3],
      }],
    };
    const { rerender } = render(<Echarts autoSize options={options} />);

    // 重新渲染组件
    rerender(<Echarts autoSize options={options} />);

    // 验证 ResizeObserver 只被创建一次
    expect(window.ResizeObserver).toHaveBeenCalledTimes(1);
  });
});
