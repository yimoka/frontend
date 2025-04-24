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
  });
});
