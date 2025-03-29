import type { Schema } from '@formily/react';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { useAdditionalNode } from '../additional-node';

/**
 * 测试 useAdditionalNode hook
 * 主要测试点：
 * 1. 正常场景：传入合法参数时的渲染结果
 * 2. 异常场景：schema 为空时的处理
 * 3. 边界场景：node 参数为 undefined 时的处理
 */

// Mock useFieldSchema
const mockUseFieldSchema = vi.fn().mockReturnValue({
  name: 'test',
  'x-additional-schema': {
    test: { type: 'string' },
  },
});

vi.mock('@formily/react', () => ({
  useFieldSchema: () => mockUseFieldSchema(),
  RecursionField: ({ children, schema }: { children: React.ReactNode; schema: Schema }) => React.createElement('div', { 'data-testid': 'recursion-field', 'data-schema': JSON.stringify(schema) }, children),
}));

describe('useAdditionalNode', () => {
  // 测试正常场景：有 node 时，应该返回 node
  it('当提供 node 时，应该返回 node', () => {
    const testNode = <div>测试节点</div>;
    const { result } = renderHook(() => useAdditionalNode('test', testNode));

    expect(result.current).toBe(testNode);
  });

  // 测试异常场景：schema 为空时的处理
  it('当 schema 为空时，应该返回传入的 node', () => {
    // 修改 mock 返回值
    mockUseFieldSchema.mockReturnValueOnce({
      name: 'test',
      'x-additional-schema': {},
    });

    const testNode = <div>测试节点</div>;
    const { result } = renderHook(() => useAdditionalNode('test', testNode));

    expect(result.current).toBe(testNode);
  });

  // 测试边界场景：node 为 undefined 且 schema 不为空时的处理
  it('当 node 为 undefined 且 schema 不为空时，应该返回 RecursionField 组件', () => {
    // 修改 mock 返回值，确保 schema 存在
    mockUseFieldSchema.mockReturnValueOnce({
      name: 'test',
      'x-additional-schema': {
        test: { type: 'string' },
      },
    });

    const { result } = renderHook(() => useAdditionalNode('test', undefined));

    expect(result.current).toBeDefined();
    if (React.isValidElement(result.current)) {
      expect(result.current.props.schema).toEqual({
        type: 'void',
        properties: {
          test: { type: 'string' },
        },
      });
    }
  });


  // 测试性能优化：验证 useMemo 的行为
  it('当依赖项未改变时，应该返回相同的引用', () => {
    const testNode = <div>测试节点</div>;
    const { result, rerender } = renderHook(
      ({ node }: { node: React.ReactNode }) => useAdditionalNode('test', node),
      {
        initialProps: { node: testNode },
      },
    );

    const firstResult = result.current;
    rerender({ node: testNode });
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });
});
