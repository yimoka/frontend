import { describe, expect, test, vi } from 'vitest';

import { JSONParse, JSONStringify } from '../json';

describe('JSONParse', () => {
  vi.spyOn(console, 'error');
  test('JSONParse', () => {
    expect(JSONParse('{"a":1}')).toEqual({ a: 1 });
    expect(JSONParse('{"a":1}', {})).toEqual({ a: 1 });
    expect(JSONParse('{"a":1}', {}, (key, value) => {
      if (key === 'a') {
        return '1';
      }
      return value;
    })).toEqual({ a: '1' });
  });

  test('JSONParse err', () => {
    expect(JSONParse('{"a":1}1')).toEqual({});
    expect(JSONParse('{"a":1}1', { a: 'a' })).toEqual({ a: 'a' });
  });
});

describe('JSONStringify', () => {
  vi.spyOn(console, 'error');
  test('JSONStringify', () => {
    expect(JSONStringify({ a: 1 })).toEqual('{"a":1}');
  });

  test('JSONStringify err', () => {
    const obj: Record<string, unknown> = { key: 'key' };
    obj.o = obj;
    const deviantArr = [null, undefined, true, false, 1, () => '', '', 'str', obj];
    deviantArr.forEach(val => expect(JSONStringify(val)).toEqual(''));
    const df = 'df';
    deviantArr.forEach(val => expect(JSONStringify(val, df)).toEqual(df));
  });
});


