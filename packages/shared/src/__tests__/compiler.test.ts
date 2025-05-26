import { describe, expect, it } from 'vitest';

import { calculate, compiler } from '../compiler';

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

  describe('函数调用', () => {
    it('应该正确处理基础函数调用', () => {
      const scope = { add: (a: number, b: number) => a + b };
      const result = compiler('add(1, 2)', scope);
      expect(result).toBe(3);
    });

    it('应该正确处理无参数函数调用', () => {
      const scope = { getValue: () => 5 };
      expect(compiler('getValue()', scope)).toBe(5);
      expect(compiler('getValue() + 10', scope)).toBe(15);
    });

    it('应该正确处理嵌套函数调用', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
      };
      expect(compiler('add(multiply(2, 3), 4)', scope)).toBe(10);
    });

    it('应该正确处理函数调用与运算符混合', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        x: 3,
        y: 4,
      };
      expect(compiler('add(x, y) * 2', scope)).toBe(14);
    });

    it('应该正确处理复杂嵌套函数调用', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        divide: (a: number, b: number) => a / b,
        x: 5,
        y: 8,
      };
      expect(compiler('add(multiply(x, 2), divide(y, 2))', scope)).toBe(14); // 5*2 + 8/2 = 10 + 4 = 14
    });

    it('应该正确处理函数调用与括号优先级', () => {
      const scope = { add: (a: number, b: number) => a + b };
      expect(compiler('(add(1, 2) + 3) * 2', scope)).toBe(12); // (3 + 3) * 2 = 12
    });

    it('应该正确处理函数调用与三元表达式', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        divide: (a: number, b: number) => a / b,
        x: 3,
        y: 4,
      };
      expect(compiler('add(x, y) > 5 ? multiply(x, 2) : divide(y, 2)', scope)).toBe(6); // add(3,4)=7 > 5 ? multiply(3,2)=6 : divide(4,2)=2 => 6
    });

    it('应该正确处理字符串参数函数调用', () => {
      const scope = {
        concat: (...args: string[]) => args.join(''),
      };
      expect(compiler('concat("hello", " ", "world")', scope)).toBe('hello world');
    });

    it('应该正确处理多层嵌套函数调用', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        subtract: (a: number, b: number) => a - b,
      };
      expect(compiler('add(multiply(add(1, 2), subtract(5, 2)), 1)', scope)).toBe(10); // add(multiply(3, 3), 1) = add(9, 1) = 10
    });

    it('应该正确处理函数调用与逻辑运算符', () => {
      const scope = {
        isPositive: (n: number) => n > 0,
        isEven: (n: number) => n % 2 === 0,
        x: 4,
        y: -2,
      };
      expect(compiler('isPositive(x) && isEven(x)', scope)).toBe(true); // true && true = true
      expect(compiler('isPositive(y) || isEven(y)', scope)).toBe(true); // false || true = true
    });

    it('应该正确处理函数调用与比较运算符', () => {
      const scope = {
        getLength: (str: string) => str.length,
        str1: 'hello',
        str2: 'world',
      };
      expect(compiler('getLength(str1) > getLength(str2)', scope)).toBe(false); // 5 > 5 = false
      expect(compiler('getLength(str1) === getLength(str2)', scope)).toBe(true); // 5 === 5 = true
    });

    it('应该对不存在的函数返回 undefined', () => {
      const scope = { x: 1 };
      expect(compiler('nonExistentFunc(x)', scope)).toBeUndefined();
    });

    it('应该对非函数类型返回 undefined', () => {
      const scope = { notAFunction: 'string' };
      expect(compiler('notAFunction(1)', scope)).toBeUndefined();
    });

    it('应该正确处理函数调用中的表达式参数', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        x: 2,
        y: 3,
      };
      expect(compiler('add(x + 1, multiply(y, 2))', scope)).toBe(9); // add(3, 6) = 9
    });

    it('应该正确处理函数调用中的嵌套括号', () => {
      const scope = {
        calculate: (a: number, b: number, c: number) => a + b * c,
      };
      expect(compiler('calculate((1 + 2), (3 + 4), (5 + 6))', scope)).toBe(80); // calculate(3, 7, 11) = 3 + 7 * 11 = 80
    });

    it('应该正确处理复杂混合表达式：(add(a,b)+1)*a', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        a: 2,
        b: 3,
      };
      expect(compiler('(add(a,b)+1)*a', scope)).toBe(12); // (add(2,3)+1)*2 = (5+1)*2 = 12
    });

    it('应该正确处理函数调用与复杂运算符优先级', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        a: 2,
        b: 3,
        c: 4,
      };
      expect(compiler('add(a, b) * c + multiply(a, c)', scope)).toBe(28); // add(2,3)*4 + multiply(2,4) = 5*4 + 8 = 28
    });

    it('应该正确处理嵌套函数调用与括号优先级', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        subtract: (a: number, b: number) => a - b,
      };
      expect(compiler('(add(1, 2) + multiply(3, 4)) * subtract(10, 5)', scope)).toBe(75); // (3 + 12) * 5 = 75
    });

    it('应该正确处理函数调用与三元运算符的复杂组合', () => {
      const scope = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        isGreater: (a: number, b: number) => a > b,
        x: 3,
        y: 5,
      };
      expect(compiler('isGreater(add(x, 2), y) ? multiply(x, y) : add(x, y)', scope)).toBe(8); // isGreater(5, 5) ? 15 : 8 = 8
    });
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
