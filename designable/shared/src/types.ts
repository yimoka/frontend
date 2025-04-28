import { IAny } from '@yimoka/shared';

const isType = <T>(type: string | string[]) => (obj: unknown): obj is T => obj !== null
  && (Array.isArray(type) ? type : [type]).some(t => getType(obj) === `[object ${t}]`);
export const getType = (obj: IAny) => Object.prototype.toString.call(obj);
export const isFn = isType<(...args: IAny[]) => IAny>([
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
]);
export const isWindow = isType<Window>('Window');
export const isHTMLElement = (obj: IAny): obj is HTMLElement => obj?.nodeName || obj?.tagName;
export const isArr = Array.isArray;
export const isPlainObj = isType<object>('Object');
export const isStr = isType<string>('String');
export const isBool = isType<boolean>('Boolean');
export const isNum = isType<number>('Number');
export const isObj = (val: unknown): val is object => typeof val === 'object';
export const isRegExp = isType<RegExp>('RegExp');
export const isValid = (val: IAny) => val !== null && val !== undefined;
