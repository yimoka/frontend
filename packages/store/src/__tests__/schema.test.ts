/**
 * @remarks schema 模块的单元测试
 * @author ickeep <i@ickeep.com>
 */

import { describe, expect, it } from 'vitest';

import type { ISchema, ISchemaEditConfigContent, ISchemaEditConfigContentItem } from '../schema';
import { mergeSchema, mergeSchemaItem } from '../schema';

describe('schema 模块', () => {
  describe('mergeSchemaItem', () => {
    it('应该正确处理空对象', () => {
      const result = mergeSchemaItem(undefined, undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('应该正确处理编辑配置为空的情况', () => {
      const obj = { name: 'test' };
      const result = mergeSchemaItem(obj, undefined, undefined);
      expect(result).toEqual(obj);
    });

    it('应该正确处理允许修改的属性', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
        allowKeys: ['name'],
        denyKeys: ['age'],
      };
      const editContent: ISchemaEditConfigContentItem = {
        keys: {
          name: {
            type: 'edit',
            value: { type: 'string', value: 'new name' },
          },
        },
      };
      const result = mergeSchemaItem(obj, editConfig, editContent);
      expect(result).toEqual({ name: { type: 'string', value: 'new name' }, age: 18 });
    });

    it('应该正确处理删除属性', () => {
      const obj = {
        name: 'test',
        age: 18,
      };
      const editConfig = {
        allowDel: ['age'],
      };
      const editContent: ISchemaEditConfigContentItem = {
        keys: {
          age: {
            type: 'del',
          },
        },
      };
      const result = mergeSchemaItem(obj, editConfig, editContent);
      expect(result).toEqual({ name: 'test' });
    });

    it('应该正确处理添加属性', () => {
      const obj = { name: 'test' };
      const editConfig = {
        allowAdd: true,
      };
      const editContent: ISchemaEditConfigContentItem = {
        keys: {},
        addKeys: [{
          key: 'age',
          value: { type: 'number', value: 18 },
        }],
      };
      const result = mergeSchemaItem(obj, editConfig, editContent);
      expect(result).toEqual({ name: 'test', age: { type: 'number', value: 18 } });
    });

    it('应该正确处理排序', () => {
      const obj = { a: { value: 1 }, b: { value: 2 }, c: { value: 3 } };
      const editConfig = {
        allowSort: true,
      };
      const editContent: ISchemaEditConfigContentItem = {
        keys: {},
        sort: ['c', 'a', 'b'],
      };
      const result = mergeSchemaItem(obj, editConfig, editContent);
      expect(result).toEqual({
        a: { value: 1, 'x-index': 1 },
        b: { value: 2, 'x-index': 2 },
        c: { value: 3, 'x-index': 0 },
      });
    });
  });

  describe('mergeSchema', () => {
    it('应该正确处理空 schema', () => {
      const schema: ISchema = {
        type: 'object',
      };
      const result = mergeSchema(schema);
      expect(result).toEqual(schema);
    });

    it('应该正确处理重复 id 的情况', () => {
      const schema: ISchema = {
        type: 'object',
        'x-id': 'root',
        properties: {
          name: {
            type: 'object',
            'x-id': 'root',
            properties: {
              title: { type: 'string' },
            },
          },
        },
      };
      const result = mergeSchema(schema);
      expect(result).toEqual(schema);
    });

    it('应该正确处理多层级的 schema 合并', () => {
      const schema: ISchema = {
        type: 'object',
        'x-id': 'root',
        properties: {
          name: {
            type: 'object',
            'x-id': 'name',
            'x-edit-config': {
              properties: {
                allowKeys: ['title'],
              },
            },
            properties: {
              title: { type: 'string' },
            },
          },
        },
      };
      const editContent: Record<string, ISchemaEditConfigContent> = {
        name: {
          properties: {
            keys: {
              title: {
                type: 'edit',
                value: { type: 'string', title: '姓名' },
              },
            },
          },
        },
      };
      const result = mergeSchema(schema, editContent);
      expect(result?.properties?.name?.properties?.title).toEqual({ type: 'string', title: '姓名' });
    });

    it('应该正确处理数组类型的 schema', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'root',
        items: {
          type: 'object',
          'x-id': 'item',
          'x-edit-config': {
            properties: {
              allowKeys: ['title'],
            },
          },
          properties: {
            title: { type: 'string' },
          },
        },
      };
      const editContent: Record<string, ISchemaEditConfigContent> = {
        item: {
          properties: {
            keys: {
              title: {
                type: 'edit',
                value: { type: 'string', title: '标题' },
              },
            },
          },
        },
      };
      const result = mergeSchema(schema, editContent);
      const items = result?.items as ISchema;
      expect(items?.properties?.title).toEqual({ type: 'string', title: '标题' });
    });
  });
});
