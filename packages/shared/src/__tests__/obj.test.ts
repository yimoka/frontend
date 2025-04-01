import { describe, it, expect } from 'vitest';

import { mergeWithArrayOverride } from '../obj';

describe('对象合并工具', () => {
  it('应正确合并两个简单对象', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('应正确合并包含数组的对象，使用源数组覆盖目标数组', () => {
    const obj1 = { a: [1, 2], b: 2 };
    const obj2 = { a: [3, 4], c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: [3, 4], b: 2, c: 4 });
  });

  it('应正确合并嵌套对象', () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: { y: 2 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 4 });
  });

  it('应正确合并包含数组和嵌套对象的复杂对象', () => {
    const obj1 = { a: { x: [1, 2] }, b: 2 };
    const obj2 = { a: { x: [3, 4], y: 2 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: [3, 4], y: 2 }, b: 2, c: 4 });
  });

  it('应支持多个对象的合并', () => {
    const obj1 = { a: 1, b: [1, 2] };
    const obj2 = { b: [3], c: [4] };
    const obj3 = { c: [5], d: 6 };
    const result = mergeWithArrayOverride(obj1, obj2, obj3);
    expect(result).toEqual({ a: 1, b: [3], c: [5], d: 6 });
  });

  it('应正确处理数组到对象的转换合并', () => {
    const obj1 = { a: [1, 2], b: 2 };
    const obj2 = { a: { x: 1 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: 1 }, b: 2, c: 4 });
  });

  it('应正确处理对象到数组的转换合并', () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: [1, 2], c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: [1, 2], b: 2, c: 4 });
  });
});
