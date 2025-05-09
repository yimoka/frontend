/**
 * schema-items-to-columns 组件测试
 * @author ickeep
 * @since 0.0.1
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Entity } from '../../components/entity/base';
import { Table } from '../__demo__/schema-items-to-columns';

describe('schema-items-to-columns 组件测试', () => {
  describe('Table 组件测试', () => {
    it('应该正确渲染表格标题和内容', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'void',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    title: '姓名',
                  },
                  age: {
                    title: '年龄',
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

      // 验证表头
      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();

      // 验证表格内容
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('当数据为空时应该渲染空表格', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'void',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    title: '姓名',
                  },
                  age: {
                    title: '年龄',
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [],
          },
        }}
      />);

      // 验证表格存在但内容为空
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText('张三')).not.toBeInTheDocument();
    });

    it('当数据为 undefined 时应该渲染空表格', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'void',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    title: '姓名',
                  },
                  age: {
                    title: '年龄',
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: undefined,
          },
        }}
      />);

      // 验证表格存在但内容为空
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText('张三')).not.toBeInTheDocument();
    });

    it('应该正确处理自定义渲染函数', () => {
      const customRender = (value: string) => <span data-testid="custom-render">{value}</span>;

      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'void',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'void',
                properties: {
                  name: {
                    title: '姓名',
                    'x-component': 'Column',
                    'x-component-props': {
                      render: customRender,
                    },
                  },
                  age: {
                    title: '年龄',
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }],
          },
        }}
      />);

      // 验证自定义渲染函数被正确应用
      expect(screen.getByTestId('custom-render')).toBeInTheDocument();
      expect(screen.getByTestId('custom-render')).toHaveTextContent('张三');
    });

    it('应该正确处理嵌套的 x-component', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'array',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'object',
                properties: {
                  name: {
                    title: '姓名',
                    'x-component': 'div',
                    'x-component-props': {
                      style: { width: '100px' },
                      children: '{{$value}}',
                    },
                  },
                  age: {
                    title: '年龄',
                    'x-component': 'input',
                    'x-component-props': {
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [{ name: '张三', age: 18 }],
          },
        }}
      />);

      // 验证嵌套组件
      const nameSpan = screen.getByText('张三');
      expect(nameSpan).toHaveStyle({ width: '100px' });
      expect(nameSpan.tagName.toLowerCase()).toBe('div');
    });

    it('应该正确处理 ColumnGroup 组件', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'array',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'object',
                properties: {
                  name: {
                    title: '姓名',
                    'x-hidden': '{{$store.values.arr.length>1}}',
                    'x-component': 'div',
                    'x-component-props': {
                      style: { width: 100 },
                      children: '{{$value}}',
                    },
                  },
                  age: {
                    title: '年龄',
                    'x-component': 'input',
                    'x-component-props': {
                      type: 'number',
                    },
                  },
                  more: {
                    type: 'void',
                    title: '更多',
                    'x-component': 'ColumnGroup',
                    properties: {
                      address: { title: '地址', 'x-hidden': true },
                      sex: { title: '性别' },
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          defaultValues: {
            arr: [
              { name: '张三', age: 18, address: '北京', sex: '男' },
              { name: '李四', age: 20, address: '上海', sex: '女' },
            ],
          },
        }}
      />);

      // 验证表头
      expect(screen.queryByText('姓名')).not.toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();
      expect(screen.getByText('更多')).toBeInTheDocument();

      // 验证表格内容
      expect(screen.queryByText('张三')).not.toBeInTheDocument();
      expect(screen.queryByText('李四')).not.toBeInTheDocument();

      // 验证输入框
      expect(screen.getByDisplayValue('18')).toBeInTheDocument();
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();


      expect(screen.getByText('男')).toBeInTheDocument();
      expect(screen.getByText('女')).toBeInTheDocument();
      expect(screen.queryByText('北京')).not.toBeInTheDocument();
      expect(screen.queryByText('上海')).not.toBeInTheDocument();
    });

    it('应该正确处理 fieldsConfig 配置中的 x-column 配置', () => {
      render(<Entity
        schema={{
          type: 'object',
          properties: {
            arr: {
              type: 'void',
              'x-component': Table,
              'x-component-props': {
                dataKey: 'values.arr',
              },
              items: {
                type: 'object',
                properties: {
                  name: {
                    title: '姓名',
                    'x-component': 'div',
                    'x-component-props': {
                      style: { width: 100 },
                      children: '{{$value}}',
                    },
                  },
                  age: {
                    title: '年龄',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '{{$value}}',
                    },
                  },
                },
              },
            },
          },
        }}
        store={{
          fieldsConfig: {
            name: {
              'x-column': {
                toolip: '标题的提示',
              },
            },
          },
          defaultValues: {
            arr: [
              { name: '张三', age: 18, address: '北京', sex: '男' },
              { name: '李四', age: 20, address: '上海', sex: '女' },
            ],
          },
        }}
      />);

      // 验证基本渲染
      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();

      // 验证 tooltip 属性
      const tooltip = screen.getByText('标题的提示');
      expect(tooltip.tagName.toLowerCase()).toBe('small');
    });
  });
});
