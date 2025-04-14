import { describe, it, expect } from 'vitest';

import { isVacuous } from '../val';

describe('空值检查', () => {
  it('应正确识别 null 值', () => {
    expect(isVacuous(null)).toBe(true);
  });

  it('应正确识别 undefined 值', () => {
    expect(isVacuous(undefined)).toBe(true);
  });

  it('应正确识别空字符串', () => {
    expect(isVacuous('')).toBe(true);
  });

  it('应正确识别非空字符串', () => {
    expect(isVacuous('hello')).toBe(false);
  });

  it('应正确识别数字 0', () => {
    expect(isVacuous(0)).toBe(false);
  });

  it('应正确识别布尔值 false', () => {
    expect(isVacuous(false)).toBe(false);
  });

  it('应正确识别空对象', () => {
    expect(isVacuous({})).toBe(true);
  });

  it('应正确识别空数组', () => {
    expect(isVacuous([])).toBe(true);
  });

  it('应正确识别非空对象', () => {
    expect(isVacuous({ key: 'value' })).toBe(false);
  });

  it('应正确识别非空数组', () => {
    expect(isVacuous([1, 2, 3])).toBe(false);
  });
});
