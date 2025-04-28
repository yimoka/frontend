import { describe, expect, it } from 'vitest';

import { getSorterFn } from '../sorter';
import { IAny } from '../type';

describe('sorter', () => {
  describe('getSorterFn', () => {
    it('自定义排序函数', () => {
      const customSorter = (a: IAny, b: IAny) => a < b;
      const sorter = getSorterFn({ autoSorter: customSorter });
      expect(sorter).toBe(customSorter);
    });


    describe('数字排序', () => {
      it('数字数组排序', () => {
        const sorter = getSorterFn({ autoSorter: 'number' });
        const arr = [3, 1, 4, 2];
        expect(arr.sort(sorter)).toEqual([1, 2, 3, 4]);
      });

      it('字符串数字排序', () => {
        const sorter = getSorterFn({ autoSorter: 'number' });
        const arr = ['3', '1', '4', '2'];
        expect(arr.sort(sorter)).toEqual(['1', '2', '3', '4']);
      });
    });

    describe('字符串排序', () => {
      it('英文字符串排序', () => {
        const sorter = getSorterFn({ autoSorter: 'string' });
        const arr = ['c', 'a', 'b', 'd'];
        expect(arr.sort(sorter)).toEqual(['a', 'b', 'c', 'd']);
      });

      it('中文字符串排序', () => {
        const sorter = getSorterFn({ autoSorter: 'string', sorterParams: 'zh' });
        const arr = ['张三', '李四', '王五', '赵六'];
        expect(arr.sort(sorter)).toEqual(['李四', '王五', '张三', '赵六']);
      });
    });

    describe('百分比排序', () => {
      it('带百分号的字符串排序', () => {
        const sorter = getSorterFn({ autoSorter: 'percentage' });
        const arr = ['50%', '20%', '80%', '10%'];
        expect(arr.sort(sorter)).toEqual(['10%', '20%', '50%', '80%']);
      });

      it('数字百分比排序', () => {
        const sorter = getSorterFn({ autoSorter: 'percentage' });
        const arr = [50, 20, 80, 10];
        expect(arr.sort(sorter)).toEqual([10, 20, 50, 80]);
      });
    });

    describe('日期排序', () => {
      it('日期字符串排序', () => {
        const sorter = getSorterFn({ autoSorter: 'date' });
        const arr = ['2023-01-01', '2022-01-01', '2024-01-01', '2021-01-01'];
        expect(arr.sort(sorter)).toEqual(['2021-01-01', '2022-01-01', '2023-01-01', '2024-01-01']);
      });
    });

    describe('时间排序', () => {
      it('时间字符串排序', () => {
        const sorter = getSorterFn({ autoSorter: 'time' });
        const arr = ['14:30', '09:00', '18:00', '08:00'];
        expect(arr.sort(sorter)).toEqual(['08:00', '09:00', '14:30', '18:00']);
      });
    });

    describe('长度排序', () => {
      it('字符串长度排序', () => {
        const sorter = getSorterFn({ autoSorter: 'length' });
        const arr = ['abc', 'a', 'abcd', 'ab'];
        expect(arr.sort(sorter)).toEqual(['a', 'ab', 'abc', 'abcd']);
      });

      it('数组长度排序', () => {
        const sorter = getSorterFn({ autoSorter: 'length' });
        const arr = [[1, 2, 3], [1], [1, 2], []];
        expect(arr.sort(sorter)).toEqual([[], [1], [1, 2], [1, 2, 3]]);
      });
    });

    it('未知排序类型返回 undefined', () => {
      const sorter = getSorterFn({ autoSorter: 'unknown' as never });
      expect(sorter).toBeUndefined();
    });
  });
});
