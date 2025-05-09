/**
 * @remarks schema 模块的单元测试
 * @author ickeep <i@ickeep.com>
 */

import { cloneDeep } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { ISchema, ISchemaEditContent, ISchemaEditContentItem } from '../schema';
import { mergeSchema, mergeSchemaContent } from '../schema';

describe('schema 模块', () => {
  describe('mergeSchemaItem', () => {
    it('应该正确处理空对象', () => {
      const result = mergeSchemaContent(undefined, undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('应该正确处理编辑配置为空的情况', () => {
      const obj = { name: 'test' };
      const result = mergeSchemaContent(obj, undefined, undefined);
      expect(result).toEqual(obj);
    });

    it('应该正确处理允许修改的属性', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
        allowKeys: ['name'],
        denyKeys: ['age'],
      };
      const editContent: ISchemaEditContentItem = {
        keys: {
          name: {
            type: 'edit',
            value: { type: 'string', value: 'new name' },
          },
        },
      };
      const result = mergeSchemaContent(obj, editConfig, editContent);
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
      const editContent: ISchemaEditContentItem = {
        keys: {
          age: {
            type: 'del',
          },
        },
      };
      const result = mergeSchemaContent(obj, editConfig, editContent);
      expect(result).toEqual({ name: 'test' });
    });

    it('应该正确处理添加属性', () => {
      const obj = { name: 'test' };
      const editConfig = {
        allowAdd: true,
      };
      const editContent: ISchemaEditContentItem = {
        keys: {},
        addKeys: [{
          key: 'age',
          value: { type: 'number', value: 18 },
        }],
      };
      const result = mergeSchemaContent(obj, editConfig, editContent);
      expect(result).toEqual({ name: 'test', age: { type: 'number', value: 18 } });
    });

    it('应该正确处理排序', () => {
      const obj = { a: { value: 1 }, b: { value: 2 }, c: { value: 3 } };
      const editConfig = {
        allowSort: true,
      };
      const editContent: ISchemaEditContentItem = {
        keys: {},
        sort: ['c', 'a', 'b'],
      };
      const result = mergeSchemaContent(obj, editConfig, editContent);
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
      const result = mergeSchema(cloneDeep(schema));
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
      const result = mergeSchema(cloneDeep(schema));
      expect(result).toEqual(schema);
    });

    it('应该在存在重复 x-id 时返回原始 schema 而不进行合并', () => {
      const schema: ISchema = {
        type: 'object',
        'x-id': 'duplicate-test',
        properties: {
          field1: {
            type: 'string',
            'x-id': 'duplicate-id',
            title: '字段1',
            'x-edit-config': {
              allowKeys: ['title'],
            },
          },
          field2: {
            type: 'string',
            'x-id': 'duplicate-id',
            title: '字段1',
            'x-edit-config': {
              allowKeys: ['title'],
            },
          },
        },
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'duplicate-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的标题',
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);
      // 由于存在重复的 x-id，函数应该返回原始 schema 而不做任何修改
      expect(result).toEqual(schema);
    });

    it('应该在数组类型items中存在重复 x-id 时返回原始 schema', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'array-test',
        items: [
          {
            type: 'object',
            'x-id': 'duplicate-array-id',
            title: '数组项1',
            'x-edit-config': {
              allowKeys: ['title'],
            },
          },
          {
            type: 'object',
            'x-id': 'duplicate-array-id',
            title: '数组项2',
            'x-edit-config': {
              allowKeys: ['title'],
            },
          },
        ],
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'duplicate-array-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的数组项',
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);
      // 由于在数组items中存在重复的 x-id，函数应该返回原始 schema
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
      const editContent: Record<string, ISchemaEditContent> = {
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
      const result = mergeSchema(cloneDeep(schema), editContent);
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
      const editContent: Record<string, ISchemaEditContent> = {
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
      const result = mergeSchema(cloneDeep(schema), editContent);
      const items = result?.items as ISchema;
      expect(items?.properties?.title).toEqual({ type: 'string', title: '标题' });
    });
  });
});
