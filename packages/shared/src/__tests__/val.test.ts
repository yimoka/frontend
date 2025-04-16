import { describe, it, expect } from 'vitest';

import { IAny } from '../type';
import { isVacuous, setSmart, getSmart } from '../val';

describe('isVacuous', () => {
  it('应该正确判断空值', () => {
    expect(isVacuous(null)).toBe(true);
    expect(isVacuous(undefined)).toBe(true);
    expect(isVacuous('')).toBe(true);
    expect(isVacuous({})).toBe(true);
    expect(isVacuous([])).toBe(true);
  });

  it('应该正确判断非空值', () => {
    expect(isVacuous(0)).toBe(false);
    expect(isVacuous(false)).toBe(false);
    expect(isVacuous('hello')).toBe(false);
    expect(isVacuous({ a: 1 })).toBe(false);
    expect(isVacuous([1])).toBe(false);
  });
});

describe('setSmart', () => {
  it('应该能够直接设置对象属性', () => {
    const obj = { a: 1, b: 2 };
    const result = setSmart(obj, 'a', 3);
    expect(result.a).toBe(3);
    expect(result.b).toBe(2);
  });

  it('应该能够设置深层路径属性', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = setSmart(obj, 'a.b.c', 2);
    expect(result.a.b.c).toBe(2);
  });

  it('应该能够处理数组路径', () => {
    const obj = { a: [1, 2, 3] };
    const result = setSmart(obj, ['a', '1'], 4);
    expect(result.a[1]).toBe(4);
  });

  it('应该能够处理点号路径格式', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = setSmart(obj, 'a.b.c', 2);
    expect(result.a.b.c).toBe(2);
  });

  it('应该能够处理数组索引路径格式', () => {
    const obj = { a: [{ b: 1 }, { b: 2 }] };
    const result = setSmart(obj, 'a[0].b', 3);
    expect(result.a[0].b).toBe(3);
  });

  it('应该能够处理混合路径格式', () => {
    const obj = { a: [{ b: { c: 1 } }] };
    const result = setSmart(obj, 'a[0].b.c', 2);
    expect(result.a[0].b.c).toBe(2);
  });

  it('应该能够处理不存在的属性', () => {
    const obj: Record<string, IAny> = { a: 1 };
    const result = setSmart(obj, 'b.c', 2);
    expect(result.b.c).toBe(2);
  });
});

describe('getSmart', () => {
  it('应该能够直接获取对象属性', () => {
    const obj = { a: 1, b: 2 };
    expect(getSmart(obj, 'a')).toBe(1);
    expect(getSmart(obj, 'b')).toBe(2);
  });

  it('应该能够获取深层路径属性', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(getSmart(obj, 'a.b.c')).toBe(1);
  });

  it('应该能够处理数组路径', () => {
    const obj = { a: [1, 2, 3] };
    expect(getSmart(obj, ['a', '1'])).toBe(2);
  });

  it('应该能够处理点号路径格式', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(getSmart(obj, 'a.b.c')).toBe(1);
  });

  it('应该能够处理数组索引路径格式', () => {
    const obj = { a: [{ b: 1 }, { b: 2 }] };
    expect(getSmart(obj, 'a[0].b')).toBe(1);
  });

  it('应该能够处理混合路径格式', () => {
    const obj = { a: [{ b: { c: 1 } }] };
    expect(getSmart(obj, 'a[0].b.c')).toBe(1);
  });

  it('应该返回默认值当属性不存在时', () => {
    const obj = { a: 1 };
    expect(getSmart(obj, 'b', 'default')).toBe('default');
    expect(getSmart(obj, 'b.c', 'default')).toBe('default');
  });

  it('应该处理边缘情况', () => {
    const obj = { a: null, b: undefined, c: '' };
    expect(getSmart(obj, 'a')).toBe(null);
    expect(getSmart(obj, 'b')).toBe(undefined);
    expect(getSmart(obj, 'c')).toBe('');
  });
});
