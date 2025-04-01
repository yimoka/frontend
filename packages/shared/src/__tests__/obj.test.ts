import { describe, it, expect } from 'vitest';

import { mergeWithArrayOverride } from '../obj';

describe('mergeWithArrayOverride', () => {
  it('should merge two simple objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge objects with arrays, overriding target arrays with source arrays', () => {
    const obj1 = { a: [1, 2], b: 2 };
    const obj2 = { a: [3, 4], c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: [3, 4], b: 2, c: 4 });
  });

  it('should merge nested objects', () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: { y: 2 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 4 });
  });

  it('should merge complex objects with arrays and nested objects', () => {
    const obj1 = { a: { x: [1, 2] }, b: 2 };
    const obj2 = { a: { x: [3, 4], y: 2 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: [3, 4], y: 2 }, b: 2, c: 4 });
  });

  it('多值合并', () => {
    const obj1 = { a: 1, b: [1, 2] };
    const obj2 = { b: [3], c: [4] };
    const obj3 = { c: [5], d: 6 };
    const result = mergeWithArrayOverride(obj1, obj2, obj3);
    expect(result).toEqual({ a: 1, b: [3], c: [5], d: 6 });
  });
  // 第一个值为数组 第二个值为对象的合并
  it('数组合并对象', () => {
    const obj1 = { a: [1, 2], b: 2 };
    const obj2 = { a: { x: 1 }, c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: { x: 1 }, b: 2, c: 4 });
  });
  // 第一个值为对象 第二个值为数组的合并
  it('对象合并数组', () => {
    const obj1 = { a: { x: 1 }, b: 2 };
    const obj2 = { a: [1, 2], c: 4 };
    const result = mergeWithArrayOverride(obj1, obj2);
    expect(result).toEqual({ a: [1, 2], b: 2, c: 4 });
  });
});
