import { describe, expect, it, vi, afterEach } from 'vitest';

import { JSONParse, JSONStringify } from '../json';

describe('JSON 解析与序列化', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  describe('JSONParse', () => {
    it('应正确解析有效的 JSON 字符串', () => {
      expect(JSONParse('{"a":1}')).toEqual({ a: 1 });
      expect(JSONParse('{"a":1}', {})).toEqual({ a: 1 });
      expect(JSONParse('{"a":1}', {}, (key, value) => {
        if (key === 'a') {
          return '1';
        }
        return value;
      })).toEqual({ a: '1' });
    });

    it('应处理无效的 JSON 字符串并返回默认值', () => {
      expect(JSONParse('{"a":1}1')).toEqual({});
      expect(JSONParse('{"a":1}1', { a: 'a' })).toEqual({ a: 'a' });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('JSONStringify', () => {
    it('应正确序列化有效的对象', () => {
      expect(JSONStringify({ a: 1 })).toEqual('{"a":1}');
    });

    it('应处理无法序列化的值并返回默认值', () => {
      const obj: Record<string, unknown> = { key: 'key' };
      obj.o = obj;
      const deviantArr = [null, undefined, true, false, 1, () => '', '', 'str', obj];
      deviantArr.forEach(val => expect(JSONStringify(val)).toEqual(''));
      const df = 'df';
      deviantArr.forEach(val => expect(JSONStringify(val, df)).toEqual(df));
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});


