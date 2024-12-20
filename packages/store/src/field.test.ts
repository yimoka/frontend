import { IAny } from '@yimoka/shared';
import { describe, it, expect } from 'vitest';

import { BaseStore } from './base';
import { valueToSearchParam, parseSearchParam, getFieldSplitter, getFieldConfig } from './field';

describe('valueToSearchParam', () => {
  it('should convert object to JSON string', () => {
    expect(valueToSearchParam({ key: 'value' })).toBe('{"key":"value"}');
  });

  it('should convert number to string', () => {
    expect(valueToSearchParam(123)).toBe('123');
  });

  it('should return string as is', () => {
    expect(valueToSearchParam('hello')).toBe('hello');
  });

  it('should return empty string for null', () => {
    expect(valueToSearchParam(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(valueToSearchParam(undefined)).toBe('');
  });
});

describe('parseSearchParam', () => {
  it('should parse number type', () => {
    expect(parseSearchParam('123', { type: 'number' })).toBe(123);
  });

  it('should parse boolean type', () => {
    expect(parseSearchParam('true', { type: 'boolean' })).toBe(true);
    expect(parseSearchParam('true', {}, false)).toBe(true);
  });

  it('should parse object type', () => {
    expect(parseSearchParam('{"key":"value"}', { type: 'object' })).toEqual({ key: 'value' });
  });

  it('should parse array type', () => {
    expect(parseSearchParam('[1,2,3]', { type: 'array' })).toEqual([1, 2, 3]);
    expect(parseSearchParam('[1,2,3]', {}, [])).toEqual([1, 2, 3]);
    expect(parseSearchParam('{}', {}, [1, 2, 3])).toEqual([]);
  });

  it('should return original string for unknown type', () => {
    expect(parseSearchParam('invalid', { type: 'unknown' })).toBe('invalid');
  });
  it('should return default value for invalid searchParam', () => {
    expect(parseSearchParam(undefined, { type: 'number' }, 0)).toBe(undefined);
  });
});

describe('getFieldSplitter', () => {
  it('should return splitter from field config', () => {
    const field = 'exampleField';
    const store = new BaseStore({
      fieldsConfig: {
        exampleField: {
          'x-splitter': ',',
        },
      },
    });
    expect(getFieldSplitter(field, store)).toBe(',');
  });

  it('should return undefined if no splitter in field config', () => {
    const field = 'exampleField';
    const store = new BaseStore({
      fieldsConfig: {
        exampleField: {},
      },
    });
    expect(getFieldSplitter(field, store)).toBeUndefined();
  });
});

describe('getFieldConfig', () => {
  it('should return field config for simple field', () => {
    const field = 'name';
    const fieldsConfig = { name: { type: 'string' } };
    expect(getFieldConfig(field, fieldsConfig)).toEqual({ type: 'string' });
  });

  it('should return field config for nested field', () => {
    const field = 'address.city';
    const fieldsConfig = {
      address: {
        properties: {
          city: { type: 'string' },
        },
      },
    };
    expect(getFieldConfig(field, fieldsConfig)).toEqual({ type: 'string' });
    expect(getFieldConfig('xxx.city', fieldsConfig)).toBeUndefined();
  });

  it('should return undefined if field config not found', () => {
    const field = 'age';
    const fieldsConfig = { name: { type: 'string' } };
    expect(getFieldConfig(field, fieldsConfig)).toBeUndefined();
  });

  it('should return undefined if no fieldsConfig provided', () => {
    const field = 'name';
    expect(getFieldConfig(field)).toBeUndefined();
  });
  // 异常的 Field
  it('should return undefined if field is invalid', () => {
    const fieldsConfig = { name: { type: 'string' } };
    const field = null as IAny;
    expect(getFieldConfig(field, fieldsConfig)).toBeUndefined();
  });
});
