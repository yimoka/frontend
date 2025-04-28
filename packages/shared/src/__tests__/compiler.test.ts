import { describe, it, expect } from 'vitest';

import { compiler, calculate } from '../compiler';

describe('compiler', () => {
  it('应该对空表达式返回 undefined', () => {
    expect(compiler('')).toBeUndefined();
    expect(compiler('a', { a: 1, b: 2 })).toBe(1);
  });

  // 变量包含了 $
  it('应该对包含 $ 的表达式返回 undefined', () => {
    expect(compiler('$a')).toBeUndefined();
    // 有值
    expect(compiler('$a', { $a: 1 })).toBe(1);
  });

  it('应该对简单表达式返回正确的值', () => {
    expect(compiler('1 + 2')).toBe(3);
    expect(compiler('1 + 2 - 3')).toBe(0);
  });

  it('应该对字符串表达式返回正确的值', () => {
    expect(compiler('"a" + "b"')).toBe('ab');
    expect(compiler('"a" + "b" + 1 + 2')).toBe('ab12');
    expect(compiler('\'a\' + \'b\'')).toBe('ab');
  });

  // boolean
  it('应该对布尔表达式返回正确的值', () => {
    expect(compiler('true')).toBe(true);
    expect(compiler('false')).toBe(false);
    expect(compiler('true && false')).toBe(false);
    expect(compiler('true || false')).toBe(true);
  });

  it('应该对包含变量的表达式返回正确的值', () => {
    expect(compiler('a + b', { a: 1, b: 2 })).toBe(3);
  });

  it('应该正确处理括号', () => {
    expect(compiler('(1 + 2) * 3')).toBe(9);
    expect(compiler('(1 + 2) % 3')).toBe(0);
  });

  it('应该正确处理嵌套括号', () => {
    expect(compiler('(1 + (2 * 3)) / 2')).toBe(3.5);
  });

  it('应该正确处理三元运算符', () => {
    expect(compiler('a > b ? a : b', { a: 2, b: 1 })).toBe(2);
  });

  it('应该正确处理逻辑运算符', () => {
    expect(compiler('a && b', { a: true, b: false })).toBe(false);
    expect(compiler('a && b && c', { a: true, b: true, c: false })).toBe(false);
  });

  it('应该正确处理比较运算符', () => {
    expect(compiler('a > b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a < b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a >= b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a <= b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a == b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a === b', { a: 2, b: 1 })).toBe(false);
    expect(compiler('a != b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a !== b', { a: 2, b: 1 })).toBe(true);
    expect(compiler('a > b > c', { a: 3, b: 2, c: 1 })).toBe(false);
  });

  it('应该正确处理一元运算符', () => {
    expect(compiler('!a', { a: false })).toBe(true);
  });


  it('应该正确处理复杂表达式', () => {
    expect(compiler('(a + b) * (c - d) / e ? f : g', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 })).toBe(6);
  });

  it('应该正确处理包含逻辑运算符的复杂表达式', () => {
    expect(compiler('a && b ? c : d', { a: true, b: false, c: 1, d: 2 })).toBe(2);
    expect(compiler('a || b ? c : d', { a: true, b: false, c: 1, d: 2 })).toBe(1);
  });

  it('应该正确处理包含比较运算符的复杂表达式', () => {
    expect(compiler('a > b ? c : d', { a: 2, b: 1, c: 1, d: 2 })).toBe(1);
  });

  it('应该正确处理包含一元运算符的复杂表达式', () => {
    expect(compiler('!a ? b : c', { a: false, b: 1, c: 2 })).toBe(1);
  });

  it('应该正确处理包含多个三元运算符的复杂表达式', () => {
    expect(compiler('a ? b : c ? d : e', { a: true, b: 1, c: false, d: 2, e: 3 })).toBe(1);
    expect(compiler('a ? b : c ? d : e', { a: false, b: 1, c: false, d: 2, e: 3 })).toBe(3);
  });

  it('应该正确处理嵌套的三元运算符', () => {
    expect(compiler('a ? b : (c ? d : (e ? f : g))', { a: false, b: 1, c: false, d: 2, e: true, f: 3, g: 4 })).toBe(3);
  });


  it('应该正确处理包含嵌套混合运算符的表达式', () => {
    expect(compiler('(a + b) * (c - d) / e > f && g || h', { a: 1, b: 2, c: 3, d: 4, e: 5, f: 0, g: true, h: false })).toBe(false);
  });

  describe('calculate', () => {
    it('应该正确处理一元运算符', () => {
      expect(calculate('!', true)).toBe(false);
      expect(calculate('!', false)).toBe(true);
    });

    it('应该正确处理加法运算', () => {
      expect(calculate('+', 1, 2)).toBe(3);
      expect(calculate('+', 'a', 'b')).toBe('ab');
    });

    it('应该正确处理减法运算', () => {
      expect(calculate('-', 3, 2)).toBe(1);
    });

    it('应该正确处理乘法运算', () => {
      expect(calculate('*', 2, 3)).toBe(6);
    });

    it('应该正确处理除法运算', () => {
      expect(calculate('/', 6, 3)).toBe(2);
    });

    it('应该正确处理取模运算', () => {
      expect(calculate('%', 5, 2)).toBe(1);
    });

    it('应该正确处理比较运算符', () => {
      expect(calculate('>', 3, 2)).toBe(true);
      expect(calculate('<', 2, 3)).toBe(true);
      expect(calculate('>=', 3, 3)).toBe(true);
      expect(calculate('<=', 2, 3)).toBe(true);
      expect(calculate('==', 2, '2')).toBe(true);
      expect(calculate('===', 2, 2)).toBe(true);
      expect(calculate('!=', 2, '3')).toBe(true);
      expect(calculate('!==', 2, '2')).toBe(true);
    });

    it('应该正确处理逻辑运算符', () => {
      expect(calculate('&&', true, false)).toBe(false);
      expect(calculate('||', true, false)).toBe(true);
    });

    it('应该对未知运算符返回 undefined', () => {
      expect(calculate('unknown', 1, 2)).toBeUndefined();
    });
  });
});
