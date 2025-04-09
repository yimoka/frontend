/**
 * @remarks Field 模块单元测试
 * @author ickeep <i@ickeep.com>
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { BaseStore } from '../base';
import { valueToSearchParam, parseSearchParam, getFieldSplitter, getFieldConfig } from '../field';

describe('Field 模块', () => {
  /**
   * 测试值转换为搜索参数
   */
  describe('valueToSearchParam', () => {
    it('应该正确处理对象值', () => {
      const value = { name: 'test', age: 18 };
      const result = valueToSearchParam(value);
      expect(result).toBe('{"name":"test","age":18}');
    });

    it('应该正确处理数字值', () => {
      const value = 123;
      const result = valueToSearchParam(value);
      expect(result).toBe('123');
    });

    it('应该正确处理字符串值', () => {
      const value = 'test';
      const result = valueToSearchParam(value);
      expect(result).toBe('test');
    });

    it('应该正确处理 null 值', () => {
      const value = null;
      const result = valueToSearchParam(value);
      expect(result).toBe('');
    });

    it('应该正确处理 undefined 值', () => {
      const value = undefined;
      const result = valueToSearchParam(value);
      expect(result).toBe('');
    });
  });

  /**
   * 测试解析搜索参数
   */
  describe('parseSearchParam', () => {
    it('应该正确解析数字类型', () => {
      const value = '123';
      const schema = { type: 'number' };
      const result = parseSearchParam(value, schema);
      expect(result).toBe(123);
    });

    it('应该正确解析布尔类型', () => {
      const value = 'true';
      const schema = { type: 'boolean' };
      const result = parseSearchParam(value, schema);
      expect(result).toBe(true);
    });

    it('应该正确解析数组类型', () => {
      const value = '[1,2,3]';
      const schema = { type: 'array' };
      const result = parseSearchParam(value, schema);
      expect(result).toEqual([1, 2, 3]);
      const result2 = parseSearchParam(value, {}, []);
      expect(result2).toEqual([1, 2, 3]);
      // 序列化后的值 如果不是数组，则返回空数组
      const result3 = parseSearchParam('{"name":"test","age":18}', schema, []);
      expect(result3).toEqual([]);
    });

    it('应该正确解析对象类型', () => {
      const value = '{"name":"test","age":18}';
      const schema = { type: 'object' };
      const result = parseSearchParam(value, schema);
      expect(result).toEqual({ name: 'test', age: 18 });
    });

    it('应该处理空值', () => {
      const value = '';
      const schema = { type: 'string' };
      const result = parseSearchParam(value, schema);
      expect(result).toBe('');
    });
  });

  /**
   * 测试获取字段分隔符
   */
  describe('getFieldSplitter', () => {
    let store: BaseStore;

    beforeEach(() => {
      store = new BaseStore({
        fieldsConfig: {
          tags: { 'x-splitter': ',' },
          categories: { 'x-splitter': '|' },
        },
      });
    });

    it('应该返回 undefined 当没有配置时', () => {
      const result = getFieldSplitter('name', store);
      expect(result).toBeUndefined();
    });

    it('应该返回自定义分隔符', () => {
      const result = getFieldSplitter('tags', store);
      expect(result).toBe(',');
    });

    it('应该返回 undefined 当字段不存在时', () => {
      const result = getFieldSplitter('nonexistent', store);
      expect(result).toBeUndefined();
    });
  });

  /**
   * 测试获取字段配置
   */
  describe('getFieldConfig', () => {
    const fieldConfig = {
      'user.name': {
        type: 'string',
        required: true,
      },
      'user.age': {
        type: 'number',
        required: true,
      },
      obj: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          age: {
            type: 'number',
          },
        },
      },
    };

    it('异常情况', () => {
      const result = getFieldConfig(1, fieldConfig);
      expect(result).toBeUndefined();
      // @ts-expect-error 类型错误
      const result2 = getFieldConfig(null, fieldConfig);
      expect(result2).toBeUndefined();
    });

    it('应该获取顶层字段配置', () => {
      const result = getFieldConfig('user.name', fieldConfig);
      expect(result).toEqual({
        type: 'string',
        required: true,
      });
      const result2 = getFieldConfig('obj.name', fieldConfig);
      expect(result2).toEqual({
        type: 'string',
      });
    });

    it('应该获取嵌套字段配置', () => {
      const result = getFieldConfig('user.age', fieldConfig);
      expect(result).toEqual({
        type: 'number',
        required: true,
      });
    });

    it('应该处理不存在的字段', () => {
      const result = getFieldConfig('nonexistent', fieldConfig);
      expect(result).toBeUndefined();
      const result2 = getFieldConfig('obj.nonexistent', fieldConfig);
      expect(result2).toBeUndefined();
    });

    it('应该处理空配置', () => {
      const result = getFieldConfig('user.name', {});
      expect(result).toBeUndefined();
    });
  });
});
