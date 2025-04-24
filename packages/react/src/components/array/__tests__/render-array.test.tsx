/**
 * RenderArray 组件测试
 * @author ickeep
 * @since 0.0.1
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Entity } from '../../entity/base';
import { RenderArray } from '../render-array';

describe('RenderArray 组件测试', () => {
  describe('正常路径测试', () => {
    it('应该正确渲染字符串数组元素', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'array',
              items: { type: 'string' },
            },
          },
        }}
        store={{ defaultValues: { arr: ['1', '2', '3'] } }}
      />);
      // 验证数组元素是否被正确渲染
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('应该正确渲染字符串数组元素+input', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'array',
              items: { type: 'string', 'x-component': 'input' },
            },
          },
        }}
        store={{ defaultValues: { arr: ['1', '2', '3'] } }}
      />);
      // 验证数组元素是否被正确渲染
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      // 验证存在 3 个 input
      expect(screen.getAllByRole('textbox')).toHaveLength(3);
    });

    it('应该正确渲染对象数组元素', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', 'x-component': 'input' },
                  age: { type: 'number', 'x-component': 'input' },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
          },
        }}
      />);

      // 验证姓名输入框
      expect(screen.getByDisplayValue('张三')).toBeInTheDocument();
      expect(screen.getByDisplayValue('李四')).toBeInTheDocument();

      // 验证年龄输入框
      expect(screen.getByDisplayValue('18')).toBeInTheDocument();
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();

      // 验证总共有 4 个输入框（2个姓名 + 2个年龄）
      expect(screen.getAllByRole('textbox')).toHaveLength(4);
    });

    it('应该正确渲染通过 data 属性传递的对象数组', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.name}}',
                    },
                  },
                  age: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.age}}',
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
          },
        }}
      />);

      // 验证姓名是否正确渲染
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();

      // 验证年龄是否正确渲染
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('应该正确渲染通过 data 属性传递的对象数组 - items 声明数据类型', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.name}}',
                    },
                  },
                  age: {
                    type: 'number',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.age}}',
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
          },
        }}
      />);

      // 验证姓名是否正确渲染
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();

      // 验证年龄是否正确渲染
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('应该正确渲染通过 data 属性传递的数组，并使用 $index 和 $value 变量', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: '{{$index + "-" + $value}}',
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: ['1', '2', '3'],
          },
        }}
      />);

      // 验证数组项是否正确渲染，包含索引和值
      expect(screen.getByText('0-1')).toBeInTheDocument();
      expect(screen.getByText('1-2')).toBeInTheDocument();
      expect(screen.getByText('2-3')).toBeInTheDocument();
    });

    it('当 items 为数组时，定义只渲染第一个元素', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: [{
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  children: '{{$index + "-" + $value}}',
                },
              }],
            },
          },
        }}
        store={{
          defaultValues: {
            arr: ['1', '2', '3'],
          },
        }}
      />);

      // 验证只渲染了第一个数组项
      expect(screen.getByText('0-1')).toBeInTheDocument();
      expect(screen.queryByText('1-2')).not.toBeInTheDocument();
      expect(screen.queryByText('2-3')).not.toBeInTheDocument();
    });

    it('应该正确渲染条件渲染的场景', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    type: 'void',
                    'x-visible': '{{$record.name === "张三"}}',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.name}}',
                    },
                  },
                  age: {
                    type: 'void',
                    'x-hidden': '{{$record.age > 18}}',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$record.age}}',
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
          },
        }}
      />);

      // 验证张三的姓名显示（因为 name === "张三"）
      expect(screen.getByText('张三')).toBeInTheDocument();
      // 验证李四的姓名不显示（因为 name !== "张三"）
      expect(screen.queryByText('李四')).not.toBeInTheDocument();

      // 验证张三的年龄显示（因为 age <= 18）
      expect(screen.getByText('18')).toBeInTheDocument();
      // 验证李四的年龄不显示（因为 age > 18）
      expect(screen.queryByText('20')).not.toBeInTheDocument();
    });

    it('component 为 Item 补充属性', () => {
      const Item = ({ children }: { children?: React.ReactNode }) => <div data-testid="item">{children}</div>;

      render(<Entity
        components={{
          Item,
        }}
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                data: '{{$store.values.arr}}',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    type: 'void',
                    'x-component': 'Item',
                  },
                  age: {
                    type: 'void',
                    'x-component': 'Item',
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
          },
        }}
      />);

      expect(screen.getByText('张三18李四20')).toBeInTheDocument();
    });

    it('应该正确渲染通过 dataKey 获取数据并自动转换为数组的场景', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'void',
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'void',
                properties: {
                  name: {},
                  age: {},
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: { name: '张三', age: 18 },
          },
        }}
      />);

      // 验证数据被正确渲染
      expect(screen.getByText('张三18')).toBeInTheDocument();
    });
  });

  // 异常路径测试
  describe('异常路径测试', () => {
    it('当 data 属性传递的值为空时，应该正确渲染空数组', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'array',
              items: { type: 'string' },
            },
          },
        }}
        store={{ defaultValues: { arr: [] } }}
      />);
      const { body } = document;
      expect(body.textContent).toBe('');
    });
    // data 有值 但 items 为空
    it('当 data 有值 但 items 为空时，应该正确渲染空数组', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              'x-component': RenderArray,
              type: 'array',
            },
          },
        }}
        store={{ defaultValues: { arr: ['1', '2', '3'] } }}
      />);
      const { body } = document;
      expect(body.textContent).toBe('');
    });
  });
});
