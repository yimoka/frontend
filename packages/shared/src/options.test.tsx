/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from 'vitest';

import { arrToOptions, strToOptions, objToOptions, dataToOptions, isValueInOptions, optionsToObj, DF_KEYS } from './options';

describe('arrToOptions', () => {
  it('should convert array to options with default keys', () => {
    const options = [{ label: 'Option 1', value: '1' }];
    const result = arrToOptions(options);
    expect(result).toEqual(options);
    expect(arrToOptions(options, DF_KEYS)).toEqual(options);
  });

  it('should convert array to options with custom keys', () => {
    const options = [{ name: 'Option 1', id: '1' }];
    const keys = { label: 'name', value: 'id' };
    const result = arrToOptions(options, keys);
    expect(result).toEqual([{ label: 'Option 1', value: '1' }]);
  });

  it('should convert array to options with children key', () => {
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
  it('should convert string to options with default keys', () => {
    const str = 'Option 1,Option 2';
    const result = strToOptions(str);
    expect(result).toEqual([{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }]);
  });

  it('should convert string to options with custom keys', () => {
    const str = 'Option 1,Option 2';
    const keys = { label: 'name', value: 'id' };
    const result = strToOptions(str, ',', keys);
    expect(result).toEqual([{ name: 'Option 1', id: 'Option 1' }, { name: 'Option 2', id: 'Option 2' }]);
  });
});

describe('objToOptions', () => {
  // 异常值
  it('异常情况', () => {
    // @ts-expect-error
    expect(objToOptions(null)).toEqual([]);
  });
  it('should convert object to options with default keys', () => {
    const obj = { a: 'Option A', b: 'Option B', c: null };
    const result = objToOptions(obj);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'c' }]);
  });

  it('should convert object to options with custom keys', () => {
    const obj = { a: { name: 'Option A' }, b: { name: 'Option B' } };
    const keys = { label: 'name' };
    const result = objToOptions(obj, keys);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]);
  });
});

describe('dataToOptions', () => {
  it('should return empty array if data is undefined', () => {
    const result = dataToOptions();
    expect(result).toEqual([]);
  });
  it('should convert array data to options', () => {
    const data = [{ label: 'Option 1', value: 1 }];
    const result = dataToOptions(data);
    expect(result).toEqual(data);
  });

  it('should convert string data to options', () => {
    const data = 'Option 1,Option 2';
    const result = dataToOptions(data);
    expect(result).toEqual([{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }]);
  });

  it('should convert object data to options', () => {
    const data = { a: 'Option A', b: 'Option B' };
    const result = dataToOptions(data);
    expect(result).toEqual([{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]);
  });
});

describe('isValueInOptions', () => {
  it('should return true if value is in options', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions(1, options);
    expect(result).toBe(true);
  });

  it('should return false if value is not in options', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions(3, options);
    expect(result).toBe(false);
  });

  it('should return true if value is in nested options', () => {
    const options = [{ value: 1, children: [{ value: 3 }] }, { value: 2 }];
    const result = isValueInOptions(3, options, { childrenKey: 'children' });
    expect(result).toBe(true);
  });

  it('should return true if value is in options', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions([1, 2], options);
    expect(result).toBe(true);
  });

  it('should return false if value is not in options', () => {
    const options = [{ value: 1 }, { value: 2 }];
    const result = isValueInOptions([1, 3], options);
    expect(result).toBe(false);
  });

  // 自定义 keys
  it('should return true if value is in options with custom keys', () => {
    const options = [{ id: 1 }, { id: 2 }];
    const keys = { value: 'id' };
    const result = isValueInOptions(1, options, { keys });
    expect(result).toBe(true);
  });
});

describe('optionsToMap', () => {
  it('should convert options to map with default keys', () => {
    const options = [{ value: 1, label: 'Option 1' }, { value: 2, label: 'Option 2' }];
    const result = optionsToObj(options);
    expect(result).toEqual({ 1: 'Option 1', 2: 'Option 2' });
  });

  it('should convert options to map with custom keys', () => {
    const options = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }];
    const keys = { value: 'id', label: 'name' };
    const result = optionsToObj(options, keys);
    expect(result).toEqual({ 1: 'Option 1', 2: 'Option 2' });
  });

  // options 异常值
  it('异常情况', () => {
    // @ts-expect-error
    expect(optionsToObj(null)).toEqual({});
    // @ts-expect-error
    expect(optionsToObj({ a: 'a' })).toEqual({ a: 'a' });
  });
});
