import { get } from 'lodash-es';

import { IAnyObject } from './type';
/**
 * 编译器函数，用于解析和计算表达式。
 *
 * @param {string} expression - 要解析的表达式字符串。
 * @param {object} [scope={}] - 可选的作用域对象，用于在表达式中查找变量。
 * @returns {any} - 返回表达式的计算结果。如果表达式为空，则返回 undefined。
 * @remarks 小程序不支持 new Function eval, 所以需要自己实现一个 compiler
 * 当前支持取值和表达式计算，支持函数调用
 * 支持基础的计算 + - * / %
 * 支持基础的比较/逻辑
 * 支持使用()改变优先级
 * 支持简单的三元表达式
 * 支持函数调用，如 func(arg1, arg2)
 * 支持嵌套函数调用，如 func1(func2(arg))
 * 支持函数调用与运算符混合使用，如 func(a) + b
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
 *
 * @example
 * ```typescript
 * const scope = {
 *   add: (a, b) => a + b,
 *   multiply: (a, b) => a * b,
 *   x: 5, y: 3
 * };
 * const result = compiler('add(x, multiply(y, 2))', scope);
 * console.log(result); // 输出: 11
 * ```
 */
export const compiler = (expression: string, scope = {}) => {
  if (!expression) {
    return undefined;
  }
  const tempObj: IAnyObject = {};

  // 解析基础值（数字、字符串、布尔值）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseBasicValue = (value: string): any => {
    // 如果是数字，直接返回
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }

    // 判断是否是字符串 被 "" 或者 '' 包裹
    if (/^"[^"]+"$/.test(value) || /^'[^']+'$/.test(value)) {
      return value.slice(1, -1);
    }

    // 判断是否是 boolean
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }

    // 不是基础值，返回 null 表示需要进一步处理
    return null;
  };

  // 专门处理函数参数的函数
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getArgValue = (arg: string): any => {
    const trimmedArg = arg.trim();

    // 尝试解析基础值
    const basicValue = parseBasicValue(trimmedArg);
    if (basicValue !== null) {
      return basicValue;
    }

    // 如果是临时 key，返回对应的值
    if (isTmpKey(trimmedArg)) {
      return tempObj[trimmedArg];
    }

    // 如果包含函数调用或表达式，使用完整的表达式处理
    if (isExpression(trimmedArg) || isFunctionCall(trimmedArg)) {
      return getValueByExp(trimmedArg);
    }

    // 否则从 scope 中获取变量值
    return get(scope, trimmedArg);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
  const getValueByExp = (val: string): any => {
    let newVal = val.trim();

    // 尝试解析基础值
    const basicValue = parseBasicValue(newVal);
    if (basicValue !== null) {
      return basicValue;
    }

    // 不存在操作符且不是函数调用，直接返回
    const isExpr = isExpression(newVal);
    const isFuncCall = isFunctionCall(newVal);
    if (!isExpr && !isFuncCall) {
      // 判断是否是临时 key
      if (isTmpKey(newVal)) {
        return tempObj[newVal];
      }
      return get(scope, newVal);
    }

    // 先处理函数调用，避免与优先级括号混淆
    // 使用更智能的方法来匹配函数调用，支持嵌套括号
    const funcCallMatch = findFunctionCall(newVal);
    if (funcCallMatch) {
      const { match, funcName, argsStr } = funcCallMatch;
      const key = crKey(match);
      const func = get(scope, funcName);

      if (typeof func === 'function') {
        // 解析参数
        const args = parseArguments(argsStr);
        // 计算每个参数的值
        const argValues = args.map((arg) => {
          const trimmedArg = arg.trim();
          return getArgValue(trimmedArg);
        });
        // 调用函数
        // eslint-disable-next-line prefer-spread
        const funcResult = func.apply(null, argValues);
        tempObj[key] = funcResult;
      } else {
        // 如果不是函数，抛出错误或返回 undefined
        tempObj[key] = undefined;
      }
      newVal = newVal.replace(match, key);
    }

    // 判断是否还有函数调用，有则递归处理
    if (isFunctionCall(newVal)) {
      return getValueByExp(newVal);
    }

    // 匹配括号(优先级括号),不带 g 采用递归的逐个处理
    newVal = newVal.replace(/\(([^()]+)\)/, (_match, p1) => {
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

    // 如果是临时 key，返回对应的值
    if (isTmpKey(newVal)) {
      return tempObj[newVal];
    }

    // 最后尝试从 scope 中获取值
    return get(scope, newVal);
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
  // 替换所有操作符标识，同时替换括号和逗号
  let newExp = expression?.replace(opExp, '_').replace(/\s/g, '')
    .replace(/[(),]/g, '_');
  // 如果表达式已包含临时key 需要去除临时标识
  newExp = newExp.replace(/__tmp__/g, '');
  return `__tmp__${r}_${newExp}__tmp__`;
};

// 以 __tmp__开头  且以 __tmp__结束
const isTmpKey = (expression: string) => /^__tmp__.*__tmp__$/.test(expression);

// 判断是否包含函数调用
const isFunctionCall = (expression: string) => {
  // 如果是临时key，不认为是函数调用
  if (isTmpKey(expression)) {
    return false;
  }
  // 匹配函数调用模式：标识符后跟括号
  return /[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*\([^)]*\)/.test(expression);
};

// 找到第一个函数调用，支持嵌套括号
const findFunctionCall = (expression: string) => {
  // 如果是临时key，不认为是函数调用
  if (isTmpKey(expression)) {
    return null;
  }

  // 匹配函数名的正则
  const funcNameRegex = /[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*/g;
  let match;

  while ((match = funcNameRegex.exec(expression)) !== null) {
    const funcName = match[0];
    const startIndex = match.index;
    const afterFuncName = startIndex + funcName.length;

    // 检查函数名后面是否紧跟着 '('
    if (expression[afterFuncName] === '(') {
      // 找到匹配的 ')'
      let depth = 0;
      let i = afterFuncName;

      for (; i < expression.length; i += 1) {
        if (expression[i] === '(') {
          depth += 1;
        } else if (expression[i] === ')') {
          depth -= 1;
          if (depth === 0) {
            // 找到了匹配的 ')'
            const fullMatch = expression.substring(startIndex, i + 1);
            const argsStr = expression.substring(afterFuncName + 1, i);
            return {
              match: fullMatch,
              funcName,
              argsStr,
            };
          }
        }
      }
    }
  }

  return null;
};

// 解析函数参数
// eslint-disable-next-line complexity
const parseArguments = (argsStr: string): string[] => {
  if (!argsStr.trim()) {
    return [];
  }

  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < argsStr.length; i += 1) {
    const char = argsStr[i];

    if (!inString) {
      if (char === '"' || char === '\'') {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === '(') {
        depth += 1;
        current += char;
      } else if (char === ')') {
        depth -= 1;
        current += char;
      } else if (char === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    } else {
      current += char;
      if (char === stringChar && argsStr[i - 1] !== '\\') {
        inString = false;
        stringChar = '';
      }
    }
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
};

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
