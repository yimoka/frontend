/* eslint-disable @typescript-eslint/ban-ts-comment */

import { describe, it, expect } from 'vitest';

import { addWithLimit, toNumber } from '../num';

describe('数字工具函数', () => {
  describe('toNumber', () => {
    it('应正确转换数字类型', () => {
      expect(toNumber(1)).toBe(1);
      expect(toNumber('1')).toBe(1);
      expect(toNumber('1.1')).toBe(1.1);
    });

    it('应处理无效的数字格式', () => {
      expect(toNumber('1.1.1')).toBeNaN();
      expect(toNumber('1.1.1', { pattern: '.[^.]+.[^.]' })).toBe(1);
    });

    it('应处理非数字类型的输入', () => {
      // @ts-expect-error
      expect(toNumber([])).toBe(0);
      // @ts-expect-error
      expect(toNumber({}, { defaults: 1 })).toBe(1);
    });

    it('应支持自定义数字格式转换', () => {
      expect(toNumber('1123', { pattern: '1', flags: '' })).toBe(123);
      expect(toNumber('1123', { pattern: '1' })).toBe(23);
    });
  });

  describe('addWithLimit', () => {
    it('应正确执行基础加法运算', () => {
      expect(addWithLimit(5, { step: 2 })).toBe(7);
      expect(addWithLimit(0, { step: 2 })).toBe(2);
      expect(addWithLimit(-1, { step: 2 })).toBe(1);
    });

    it('应处理最大值限制', () => {
      expect(addWithLimit(999, { step: 2 })).toBe(1000);
      expect(addWithLimit(1000, { step: 2 })).toBe(0);
    });

    it('应支持自定义最大值和最小值', () => {
      expect(addWithLimit(5, { step: 2, max: 6 })).toBe(6);
      expect(addWithLimit(5, { step: 2, min: 6 })).toBe(7);
    });

    it('应支持初始值设置', () => {
      expect(addWithLimit(5, { step: 2, initial: 10 })).toBe(7);
      expect(addWithLimit(1000, { step: 2, initial: 10 })).toBe(10);
    });
  });
});

