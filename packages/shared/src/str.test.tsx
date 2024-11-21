import { describe, it, expect } from 'vitest';

import { strToArr } from './str';
import { IAnyObject } from './type';

describe('str', () => {
  const testArr: IAnyObject[] = [
    { value: undefined, result: [] },
    { value: null, result: [] },
    { value: true, result: [] },
    { value: false, result: [] },
    { value: {}, result: [] },
    { value: () => '', result: [] },
    { name: '空字符', value: '', result: [] },
    { value: '1,2,3', result: ['1', '2', '3'] },
    { value: 'a,b,c', result: ['a', 'b', 'c'] },
  ];
  testArr?.forEach((item) => {
    it(`strToArr - ${item.name ?? item.value}`, () => {
      expect(strToArr(item.value)).toEqual(item.result);
    });
  });
  it('strToArr - splitter', () => {
    expect(strToArr('a|b,c', '|')).toEqual(['a', 'b,c']);
  });
});
