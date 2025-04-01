/**
 * @file schema-items.test.tsx
 * @remarks Schema 工具函数模块单元测试
 * @author yimoka development team
 * @module @yimoka/react
 */

import { Schema, SchemaKey } from '@formily/react';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  getPropsByItemSchema,
  isItemSchemaRecursion,
  isItemSchemaVisible,
  schemaItemsReduce,
  getSchemaNameByFieldSchema,
} from '../schema-items';

describe('Schema 工具函数模块', () => {
  describe('getPropsByItemSchema 函数', () => {
    it('应该正确提取空 schema 的属性', () => {
      const schema = new Schema({});
      const result = getPropsByItemSchema(schema);
      expect(result).toEqual({});
    });

    it('应该正确映射 schema 属性', () => {
      const schema = new Schema({
        title: '测试标题',
        description: '测试描述',
      });
      const propsMap = {
        label: 'title',
        tooltip: 'description',
      };
      const result = getPropsByItemSchema(schema, undefined, propsMap);
      expect(result).toEqual({
        label: '测试标题',
        tooltip: '测试描述',
      });
    });

    it('应该正确合并装饰器属性', () => {
      const schema = new Schema({
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
      });
      const result = getPropsByItemSchema(schema, 'FormItem');
      expect(result).toEqual({
        labelCol: 6,
        wrapperCol: 18,
      });
    });

    it('应该正确合并组件属性', () => {
      const schema = new Schema({
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入',
          allowClear: true,
        },
      });
      const result = getPropsByItemSchema(schema, 'Input');
      expect(result).toEqual({
        placeholder: '请输入',
        allowClear: true,
      });
    });

    it('应该正确合并所有属性', () => {
      const schema = new Schema({
        title: '测试标题',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入',
        },
      });
      const propsMap = {
        label: 'title',
      };
      const result = getPropsByItemSchema(schema, 'FormItem', propsMap);
      expect(result).toEqual({
        label: '测试标题',
        labelCol: 6,
      });
    });
  });

  describe('isItemSchemaRecursion 函数', () => {
    it('应该在 schema 有子属性时返回 true', () => {
      const schema = new Schema({
        properties: {
          name: {
            type: 'string',
          },
        },
      });
      expect(isItemSchemaRecursion(schema)).toBe(true);
    });

    it('应该在装饰器不匹配时返回 true', () => {
      const schema = new Schema({
        'x-decorator': 'FormItem',
      });
      expect(isItemSchemaRecursion(schema, 'Input')).toBe(true);
    });

    it('应该在组件不匹配时返回 true', () => {
      const schema = new Schema({
        'x-component': 'Input',
      });
      expect(isItemSchemaRecursion(schema, 'Select')).toBe(true);
    });

    it('应该在没有子属性且装饰器和组件匹配时返回 false', () => {
      const schema = new Schema({
        'x-decorator': 'FormItem',
        'x-component': 'FormItem',
      });
      expect(isItemSchemaRecursion(schema, 'FormItem')).toBe(false);
    });
  });

  describe('isItemSchemaVisible 函数', () => {
    it('应该在 x-hidden 为 true 时返回 false', () => {
      const schema = new Schema({
        'x-hidden': true,
      });
      expect(isItemSchemaVisible(schema)).toBe(false);
    });

    it('应该在 x-hidden 表达式计算为 true 时返回 false', () => {
      const schema = new Schema({
        'x-hidden': '{{ isHidden }}',
      });
      expect(isItemSchemaVisible(schema, { isHidden: true })).toBe(false);
    });

    it('应该在 x-visible 为 false 时返回 false', () => {
      const schema = new Schema({
        'x-visible': false,
      });
      expect(isItemSchemaVisible(schema)).toBe(false);
    });

    it('应该在 x-visible 表达式计算为 false 时返回 false', () => {
      const schema = new Schema({
        'x-visible': '{{ isVisible }}',
      });
      expect(isItemSchemaVisible(schema, { isVisible: false })).toBe(false);
    });

    it('应该在 x-display 不为 visible 时返回 false', () => {
      const schema = new Schema({
        'x-display': 'none',
      });
      expect(isItemSchemaVisible(schema)).toBe(false);
    });

    it('应该在所有条件都满足时返回 true', () => {
      const schema = new Schema({
        'x-hidden': false,
        'x-visible': true,
        'x-display': 'visible',
      });
      expect(isItemSchemaVisible(schema)).toBe(true);
    });
  });

  describe('schemaItemsReduce 函数', () => {
    it('应该在 schema 为空时返回 undefined', () => {
      const result = schemaItemsReduce(
        undefined as unknown as Schema,
        {},
        () => ({}),
      );
      expect(result).toBeUndefined();
    });

    it('应该在 items 为空时返回 undefined', () => {
      const schema = new Schema({});
      const result = schemaItemsReduce(
        schema,
        {},
        () => ({}),
      );
      expect(result).toBeUndefined();
    });

    it('应该正确处理非数组 items', () => {
      const schema = new Schema({
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        },
      });

      const toProps = (itemSchema: Schema, key: SchemaKey, _index: number) => ({
        key,
        type: itemSchema.type,
      });

      const result = schemaItemsReduce(schema, {}, toProps);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(expect.objectContaining({ key: 'name' }));
      expect(result).toContainEqual(expect.objectContaining({ key: 'age' }));
    });

    it('应该正确处理数组 items', () => {
      const schema = new Schema({
        items: [
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'number' },
            },
          },
        ],
      });

      const toProps = (itemSchema: Schema, key: SchemaKey, _index: number) => ({
        key,
        type: itemSchema.type,
      });

      const result = schemaItemsReduce(schema, {}, toProps);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(expect.objectContaining({ key: 'name' }));
      expect(result).toContainEqual(expect.objectContaining({ key: 'age' }));
    });

    it('应该过滤不可见的项', () => {
      const schema = new Schema({
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number', 'x-hidden': true },
          },
        },
      });

      const toProps = (itemSchema: Schema, key: SchemaKey, _index: number) => ({
        key,
        type: itemSchema.type,
      });

      const result = schemaItemsReduce(schema, {}, toProps);
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(expect.objectContaining({ key: 'name' }));
      expect(result).not.toContainEqual(expect.objectContaining({ key: 'age' }));
    });
  });

  describe('getSchemaNameByFieldSchema 函数', () => {
    let rootSchema: Schema;
    let fieldSchema: Schema;

    beforeEach(() => {
      rootSchema = new Schema({
        type: 'object',
        name: 'form',
        properties: {
          name: {
            type: 'string',
            title: '姓名',
          },
          address: {
            type: 'object',
            name: 'address',
            properties: {
              province: {
                type: 'string',
                title: '省份',
              },
              city: {
                type: 'string',
                title: '城市',
              },
            },
          },
        },
      });

      fieldSchema = rootSchema;
    });

    it('应该正确获取顶层字段的名称', () => {
      const nameSchema = rootSchema.properties!.name;
      const result = getSchemaNameByFieldSchema(nameSchema, fieldSchema);
      expect(result).toBe('name');
    });

    it('应该正确获取嵌套字段的名称', () => {
      const addressSchema = rootSchema.properties!.address;
      const provinceSchema = addressSchema.properties!.province;
      const result = getSchemaNameByFieldSchema(provinceSchema, rootSchema);
      expect(result).toBe('address.province');
    });

    it('应该在 type 为 void 时正确处理', () => {
      const voidSchema = new Schema({
        type: 'void',
        name: 'actions',
        properties: {
          submit: {
            type: 'void',
            'x-component': 'Button',
          },
        },
      });

      rootSchema.addProperty('actions', voidSchema);
      const submitSchema = voidSchema.properties!.submit;
      const result = getSchemaNameByFieldSchema(submitSchema, fieldSchema);
      expect(result).toBeUndefined();
    });

    it('应该正确处理当前已累积的名称', () => {
      const addressSchema = rootSchema.properties!.address;
      const citySchema = addressSchema.properties!.city;
      const partialName = 'partial';
      const result = getSchemaNameByFieldSchema(citySchema, fieldSchema, partialName);
      expect(result).toBe('address.city.partial');
    });
  });
});
