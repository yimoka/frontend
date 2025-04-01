import { describe, it, expect } from 'vitest';

import { autoTry } from '../try';

describe('自动错误处理', () => {
  it('当函数正常执行时应返回其结果', () => {
    const result = autoTry(() => 42);
    expect(result).toBe(42);
  });

  it('当函数抛出错误时应返回默认值', () => {
    const result = autoTry(() => {
      throw new Error('Test error');
    }, 'default');
    expect(result).toBe('default');
  });

  it('当函数抛出错误时应调用错误处理函数', () => {
    const handler = (e: Error) => `Handled: ${e.message}`;
    const result = autoTry(() => {
      throw new Error('Test error');
    }, undefined, handler);
    expect(result).toBe('Handled: Test error');
  });

  it('当函数抛出错误且未提供默认值或处理函数时应返回 undefined', () => {
    const result = autoTry(() => {
      throw new Error('Test error');
    });
    expect(result).toBeUndefined();
  });
});
