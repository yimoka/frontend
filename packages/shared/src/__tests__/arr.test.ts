import { describe, it, expect } from 'vitest';

import { normalizeToArray } from '../arr';

describe('数组标准化工具', () => {
  it('当输入为数组时应返回原数组', () => {
    const input = [1, 2, 3];
    const result = normalizeToArray(input);
    expect(result).toBe(input);
  });

  it('当输入为 null 时应返回空数组', () => {
    const result = normalizeToArray(null);
    expect(result).toEqual([]);
  });

  it('当输入为 undefined 时应返回空数组', () => {
    const result = normalizeToArray(undefined);
    expect(result).toEqual([]);
  });

  it('当输入为空字符串时应返回空数组', () => {
    const result = normalizeToArray('');
    expect(result).toEqual([]);
  });

  it('当输入为非数组且非空值时应返回包含该值的数组', () => {
    const input = 42;
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });

  it('当输入为非空字符串时应返回包含该字符串的数组', () => {
    const input = 'hello';
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });
});
