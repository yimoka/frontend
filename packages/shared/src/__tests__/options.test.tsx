/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from 'vitest';

import { arrToOptions, strToOptions, objToOptions, dataToOptions, isValueInOptions, optionsToObj, DF_KEYS } from '../options';

describe('arrToOptions', () => {
  it('应该使用默认键将数组转换为选项', () => {
    const options = [{ label: 'Option 1', value: '1' }];
    const result = arrToOptions(options);
    expect(result).toEqual(options);
    expect(arrToOptions(options, DF_KEYS)).toEqual(options);
  });

  it('应该使用自定义键将数组转换为选项', () => {
    const options = [{ name: 'Option 1', id: '1' }];
    const keys = { label: 'name', value: 'id' };
    const result = arrToOptions(options, keys);
    expect(result).toEqual([{ label: 'Option 1', value: '1' }]);
  });

  it('应该使用子键将数组转换为选项', () => {
    const options = [
      { id: '1', name: '1', children: [{ id: '11', name: '11' }] },
      { id: '2', name: '2' },
      { id: '3', name: '3', children: null },
      { id: 4, name: '4', children: { 1: { id: 1, name: '1' } } },
    ];
    const keys = { label: 'name', value: 'id' };
    expect(arrToOptions(options, keys, 'children')).toEqual([
      { label: '1', value: '1', children: [{ label: '11', value: '11' }] },
      { label: '2', value: '2' },
      { label: '3', value: '3', children: [] },
      { label: '4', value: 4, children: [{ label: '1', value: 1 }] },
    ]);
  });
});

describe('strToOptions', () => {
  it('应该使用默认键将字符串转换为选项', () => {
    const str = 'Option 1,Option 2';
    const result = strToOptions(str);
    expect(result).toEqual([{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }]);
  });

  it('应该使用自定义键将字符串转换为选项', () => {
    const str = 'Option 1,Option 2';
    const keys = { label: 'name', value: 'id' };
    const result = strToOptions(str, ',', keys);
    expect(result).toEqual([{ name: 'Option 1', id: 'Option 1' }, { name: 'Option 2', id: 'Option 2' }]);
  });
});

describe('objToOptions', () => {
  it('应该处理异常值', () => {
    // @ts-expect-error
    expect(objToOptions(null)).toEqual([]);
  });

  it('应该使用默认键将对象转换为选项', () => {
    const obj = { a: 'Option A', b: 'Option B', c: null };
    const result = objToOptions(obj);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'c' }]);
  });

  it('应该使用自定义键将对象转换为选项', () => {
    const obj = { a: { name: 'Option A' }, b: { name: 'Option B' } };
    const keys = { label: 'name' };
    const result = objToOptions(obj, keys);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]);
  });
});

describe('dataToOptions', () => {
  it('如果数据为 undefined 应该返回空数组', () => {
    const result = dataToOptions();
    expect(result).toEqual([]);
  });

  it('应该将数组数据转换为选项', () => {
    const data = [{ label: 'Option 1', value: 1 }];
    const result = dataToOptions(data);
    expect(result).toEqual(data);
  });

  it('应该将字符串数据转换为选项', () => {
    const data = 'Option 1,Option 2';
    const result = dataToOptions(data);
    expect(result).toEqual([{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }]);
  });

  it('应该将对象数据转换为选项', () => {
    const data = { a: 'Option A', b: 'Option B' };
    const result = dataToOptions(data);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]);
  });
});

describe('isValueInOptions', () => {
  it('如果值在选项中应该返回 true', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions(1, options);
    expect(result).toBe(true);
  });

  it('如果值不在选项中应该返回 false', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions(3, options);
    expect(result).toBe(false);
  });

  it('如果值在嵌套选项中应该返回 true', () => {
    const options = [{ value: 1, children: [{ value: 3 }] }, { value: 2 }];
    const result = isValueInOptions(3, options, { childrenKey: 'children' });
    expect(result).toBe(true);
  });

  it('如果值数组在选项中应该返回 true', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions([1, 2], options);
    expect(result).toBe(true);
  });

  it('如果值数组不在选项中应该返回 false', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions([1, 3], options);
    expect(result).toBe(false);
  });

  it('如果值在使用自定义键的选项中应该返回 true', () => {
    const options = [{ id: 1 }, { id: 2 }];
    const keys = { value: 'id' };
    const result = isValueInOptions(1, options, { keys });
    expect(result).toBe(true);
  });
});

describe('optionsToMap', () => {
  it('应该使用默认键将选项转换为映射', () => {
    const options = [{ value: 1, label: 'Option 1' }, { value: 2, label: 'Option 2' }];
    const result = optionsToObj(options);
    expect(result).toEqual({ 1: 'Option 1', 2: 'Option 2' });
  });

  it('应该使用自定义键将选项转换为映射', () => {
    const options = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }];
    const keys = { value: 'id', label: 'name' };
    const result = optionsToObj(options, keys);
    expect(result).toEqual({ 1: 'Option 1', 2: 'Option 2' });
  });

  it('应该处理选项的异常值', () => {
    // @ts-expect-error
    expect(optionsToObj(null)).toEqual({});
    // @ts-expect-error
    expect(optionsToObj({ a: 'a' })).toEqual({ a: 'a' });
  });
});
