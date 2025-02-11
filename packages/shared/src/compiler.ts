import { get } from 'lodash-es';

import { IAnyObject } from './type';
/**
 * 编译器函数，用于解析和计算表达式。
 *
 * @param {string} expression - 要解析的表达式字符串。
 * @param {object} [scope={}] - 可选的作用域对象，用于在表达式中查找变量。
 * @returns {any} - 返回表达式的计算结果。如果表达式为空，则返回 undefined。
 * @remarks 小程序不支持 new Function eval, 所以需要自己实现一个 compiler
 * 当前只支持取值和简单的表达式计算，不支持函数及函数调用
 * 支持基础的计算 + - * / %
 * 支持基础的比较/逻辑
 * 支持使用()改变优先级
 * 支持简单的三元表达式
 *
 * @example
 * ```typescript
 * const result = compiler('1 + 2');
 * console.log(result); // 输出: 3
 * ```
 *
 * @example
 * ```typescript
 * const scope = { a: 1, b: 2 };
 * const result = compiler('a + b', scope);
 * console.log(result); // 输出: 3
 * ```
 */
export const compiler = (expression: string, scope = {}) => {
  if (!expression) {
    return undefined;
  }
  const tempObj: IAnyObject = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
  const getValueByExp = (val: string): any => {
    let newVal = val.trim();
    // 如果是数字，直接返回
    if (!Number.isNaN(Number(newVal))) {
      return Number(newVal);
    }

    // 判断是否是字符串 被 "" 或者 '' 包裹 正则判断,并且中间不包含 "" 或者 ''
    if (/^"[^"]+"$/.test(newVal) || /^'[^']+'$/.test(newVal)) {
      return newVal.slice(1, -1);
    }
    // 判断是否是 boolean
    if (newVal === 'true') {
      return true;
    }
    if (newVal === 'false') {
      return false;
    }

    // 不存在操作符，直接返回
    if (!isExpression(newVal)) {
      // 判断是否是临时 key
      if (isTmpKey(newVal)) {
        return tempObj[newVal];
      }
      return get(scope, newVal);
    }

    // 匹配括号,不带 g 采用递归的逐个处理
    newVal = val.replace(/\(([^()]+)\)/, (_match, p1) => {
      const key = crKey(p1);
      tempObj[key] = getValueByExp(p1);
      return key;
    });


    // 判断是否还有()，有则递归处理
    if (newVal.includes('(')) {
      return getValueByExp(newVal);
    }
    // 匹配三元表达式 ,不带 g 采用递归的逐个处理
    newVal = newVal.replace(/([^?]+)\?([^:]+):([\w\W]+)/, (_match, p1, p2, p3) => {
      const key = crKey(p1);
      const v1 = getValueByExp(p1);
      if (v1) {
        tempObj[key] = getValueByExp(p2);
      } else {
        tempObj[key] = getValueByExp(p3);
      }
      return key;
    });

    // 匹配左侧操作符
    // 支持的左侧操作符为 !
    newVal = newVal.replace(getLeftReg(['!']), (match, p1, p2) => {
      const key = crKey(match);
      const v1 = getValueByExp(p2);
      tempObj[key] = calculate(p1, v1);
      return key;
    });

    // 匹配  * / % 运算符 不带 g 采用递归的逐个处理
    const mathOperators = ['*', '/', '%'];
    newVal = newVal.replace(getBothReg(['*', '/', '%']), (match, p1, p2, p3) => {
      const key = crKey(match);
      tempObj[key] = calculate(p2, getValueByExp(p1), getValueByExp(p3));
      return key;
    });

    // 判断是否还有 * / %，有则递归处理
    if (mathOperators.some(op => newVal.includes(op))) {
      return getValueByExp(newVal);
    }

    // 匹配   + -  运算符 不带 g 采用递归的逐个处理
    const mathOperators2 = ['+', '-'];
    newVal = newVal.replace(getBothReg(['+', '-']), (match, p1, p2, p3) => {
      const key = crKey(match);
      tempObj[key] = calculate(p2, getValueByExp(p1), getValueByExp(p3));
      return key;
    });

    // 判断是否还有 + -，有则递归处理
    if (mathOperators2.some(op => newVal.includes(op))) {
      return getValueByExp(newVal);
    }

    // 匹配比较运算符
    const compareOperators = ['>', '<', '>=', '<=', '==', '===', '!=', '!=='];
    newVal = newVal.replace(getBothReg(compareOperators), (match, p1, p2, p3) => {
      const key = crKey(match);
      tempObj[key] = calculate(p2, getValueByExp(p1), getValueByExp(p3));
      return key;
    });
    // 判断是否还有 > < >= <= == === != !==，有则递归处理
    if (compareOperators.some(op => newVal.includes(op))) {
      return getValueByExp(newVal);
    }

    // 匹配逻辑运算符
    const logicOperators = ['&&', '||'];
    newVal = newVal.replace(getBothReg(logicOperators), (match, p1, p2, p3) => {
      const key = crKey(match);
      tempObj[key] = calculate(p2, getValueByExp(p1), getValueByExp(p3));
      return key;
    });
    // 判断是否还有 && ||，有则递归处理
    if (logicOperators.some(op => newVal.includes(op))) {
      return getValueByExp(newVal);
    }
    return getValueByExp(newVal);
  };

  return getValueByExp(expression);
};

// 操作符
const opArr = ['+', '-', '*', '/', '%', '>', '<', '=', '&&', '||', '!'];
// 三元操作符
const ternaryOp = ['?', ':'];
// 字符转化为正则字符
const toRegStr = (str: string): string => {
  const len = str?.length;
  if (len === 1) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  return str.split('')
    .map(item => toRegStr(item))
    .join('');
};
//  根据 opArr，ternaryOp，  非操作符 的正则字符串
const notOpExpStr = `[^${[...opArr, ...ternaryOp].map(toRegStr).join('')}]+`;
// 所有操作符的正则字符串
const opExpStr = `(${[...opArr, ...ternaryOp].map(toRegStr).join('|')})`;
// 匹配所有操作符的正则
const opExp = new RegExp(opExpStr, 'g');

// 判断是否是表达式
export const isExpression = (expression: string) => [...opArr, ...ternaryOp].some(op => expression.includes(op));

// 获取匹配两边非操作符的正则
const getBothReg = (op: string[]) => {
  const regStr = `(${notOpExpStr})(${op.map(toRegStr).join('|')})(${notOpExpStr})`;
  return new RegExp(regStr);
};

// 获取匹配左边操作符的正则
const getLeftReg = (op: string[]) => {
  const regStr = `(${op.map(toRegStr).join('|')})(${notOpExpStr})`;
  return new RegExp(regStr, 'g');
};

// 生成临时的 key
const crKey = (expression: string) => {
  // 随机数
  const r = Math.random().toString(36)
    .substring(2);
  // 替换所有操作符标识
  let newExp = expression?.replace(opExp, '_').replace(/\s/g, '');
  // 如果表达式已包含临时key 需要去除临时标识
  newExp = newExp.replace(/__tmp__/g, '');
  return `__tmp__${r}_${newExp}__tmp__`;
};

// 以 __tmp__开头  且以 __tmp__结束
const isTmpKey = (expression: string) => /^__tmp__.*__tmp__$/.test(expression);

// eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
export function calculate(op: string, a: any, b?: any) {
  switch (op) {
    case '!':
      return !a;
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    case '%':
      return a % b;
    case '>':
      return a > b;
    case '<':
      return a < b;
    case '>=':
      return a >= b;
    case '<=':
      return a <= b;
    case '==':
      // eslint-disable-next-line eqeqeq
      return a == b;
    case '===':
      return a === b;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return a != b;
    case '!==':
      return a !== b;
    case '&&':
      return a && b;
    case '||':
      return a || b;
    default:
      return undefined;
  }
}
