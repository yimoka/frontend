import { describe, it, expect } from 'vitest';

import { isBlank } from '../val';

describe('空值检查', () => {
  it('应正确识别 null 值', () => {
    expect(isBlank(null)).toBe(true);
  });

  it('应正确识别 undefined 值', () => {
    expect(isBlank(undefined)).toBe(true);
  });

  it('应正确识别空字符串', () => {
    expect(isBlank('')).toBe(true);
  });

  it('应正确识别非空字符串', () => {
    expect(isBlank('hello')).toBe(false);
  });

  it('应正确识别数字 0', () => {
    expect(isBlank(0)).toBe(false);
  });

  it('应正确识别布尔值 false', () => {
    expect(isBlank(false)).toBe(false);
  });

  it('应正确识别空对象', () => {
    expect(isBlank({})).toBe(true);
  });

  it('应正确识别空数组', () => {
    expect(isBlank([])).toBe(true);
  });

  it('应正确识别非空对象', () => {
    expect(isBlank({ key: 'value' })).toBe(false);
  });

  it('应正确识别非空数组', () => {
    expect(isBlank([1, 2, 3])).toBe(false);
  });
});
