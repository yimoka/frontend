import { describe, it, expect } from 'vitest';

import { strToArr } from '../str';
import { IAnyObject } from '../type';

describe('字符串工具函数', () => {
  describe('strToArr', () => {
    const testArr: IAnyObject[] = [
      { value: undefined, name: '未定义值', result: [] },
      { value: null, name: '空值', result: [] },
      { value: true, name: '布尔值 true', result: [] },
      { value: false, name: '布尔值 false', result: [] },
      { value: {}, name: '空对象', result: [] },
      { value: () => '', name: '函数', result: [] },
      { value: '', name: '空字符串', result: [] },
      { value: '1,2,3', name: '数字字符串', result: ['1', '2', '3'] },
      { value: 'a,b,c', name: '字母字符串', result: ['a', 'b', 'c'] },
    ];

    testArr?.forEach((item) => {
      it(`将${item.name}转换为数组`, () => {
        expect(strToArr(item.value)).toEqual(item.result);
      });
    });

    it('使用自定义分隔符分割字符串', () => {
      expect(strToArr('a|b,c', '|')).toEqual(['a', 'b,c']);
    });
  });
});
