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

    it('应该正确处理allowKeys为undefined的情况', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
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
      // 由于allowKeys未定义，isAllowedKey返回false，所以name不应该被修改
      expect(result).toEqual(obj);
    });

    it('应该正确处理allowKeys为空对象的情况', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allowKeys: {} as any,
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
      // 由于allowKeys是空对象，isAllowedKey返回false，所以name不应该被修改
      expect(result).toEqual(obj);
    });

    it('应该正确处理allowKeys为空数组的情况', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
        allowKeys: [],
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
      // 由于key不在空的allowKeys数组中，isAllowedKey返回false，所以name不应该被修改
      expect(result).toEqual(obj);
    });

    it('应该正确处理allowKeys为false的情况', () => {
      const obj = { name: 'test', age: 18 };
      const editConfig = {
        allowKeys: false,
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
      // 由于allowKeys为false，isAllowedKey返回false，所以name不应该被修改
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

    it('应该在单个对象类型items中与其他字段存在重复 x-id 时返回原始 schema', () => {
      const schema: ISchema = {
        type: 'object',
        'x-id': 'object-with-items-test',
        properties: {
          field1: {
            type: 'string',
            'x-id': 'duplicate-object-id',
            title: '字段1',
          },
        },
        items: {
          type: 'object',
          'x-id': 'duplicate-object-id',
          title: '单个对象项',
          'x-edit-config': {
            allowKeys: ['title'],
          },
        },
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'duplicate-object-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的对象',
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);
      // 由于在单个对象items中与properties字段存在重复的 x-id，函数应该返回原始 schema
      expect(result).toEqual(schema);
    });

    it('应该在嵌套的单个对象类型items中存在重复 x-id 时返回原始 schema', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'nested-items-test',
        items: {
          type: 'object',
          'x-id': 'parent-item',
          properties: {
            nestedArray: {
              type: 'array',
              items: {
                type: 'object',
                'x-id': 'nested-duplicate',
                title: '嵌套项1',
                'x-edit-config': {
                  allowKeys: ['title'],
                },
              },
            },
            anotherField: {
              type: 'object',
              'x-id': 'nested-duplicate',
              title: '嵌套项2',
            },
          },
        },
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'nested-duplicate': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的嵌套项',
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);
      // 由于在嵌套的单个对象items中存在重复的 x-id，函数应该返回原始 schema
      expect(result).toEqual(schema);
    });

    it('应该在schema中的x-edit-config为空时不进行编辑操作', () => {
      const schema: ISchema = {
        type: 'object',
        'x-id': 'empty-edit-config-test',
        properties: {
          field1: {
            type: 'string',
            'x-id': 'field1-id',
            title: '字段1',
            // 没有x-edit-config
          },
          field2: {
            type: 'string',
            'x-id': 'field2-id',
            title: '字段2',
            'x-edit-config': undefined, // x-edit-config为undefined
          },
          field3: {
            type: 'string',
            'x-id': 'field3-id',
            title: '字段3',
            'x-edit-config': {}, // x-edit-config为空对象
          },
        },
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'field1-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的字段1',
            },
          },
        },
        'field2-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的字段2',
            },
          },
        },
        'field3-id': {
          keys: {
            title: {
              type: 'edit',
              value: '修改后的字段3',
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);

      // 当x-edit-config为空时，应该不进行任何修改，保持原始值
      expect(result.properties?.field1.title).toEqual('字段1');
      expect(result.properties?.field2.title).toEqual('字段2');
      expect(result.properties?.field3.title).toEqual('字段3');
    });

    it('应该正确处理数组类型的items配置和内容编辑', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'array-items-test',
        'x-edit-config': {
          items: [
            {
              allowKeys: ['title', 'description'],
            },
            {
              allowKeys: ['title', 'required'],
            },
            {
              allowKeys: ['enum', 'default'],
            },
          ],
        },
        items: [
          {
            type: 'string',
            title: '项目1',
            description: '项目1的描述',
          },
          {
            type: 'number',
            title: '项目2',
            required: true,
          },
          {
            type: 'string',
            enum: ['a', 'b', 'c'],
            default: 'a',
          },
        ],
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'array-items-test': {
          items: [
            {
              keys: {
                title: {
                  type: 'edit',
                  value: '修改后的项目1',
                },
                description: {
                  type: 'edit',
                  value: '修改后的项目1描述',
                },
              },
            },
            {
              keys: {
                title: {
                  type: 'edit',
                  value: '修改后的项目2',
                },
                required: {
                  type: 'edit',
                  value: false,
                },
              },
            },
            {
              keys: {
                enum: {
                  type: 'edit',
                  value: ['x', 'y', 'z'],
                },
                default: {
                  type: 'edit',
                  value: 'x',
                },
              },
            },
          ],
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);

      // 验证每个数组项是否被正确修改
      const items = result.items as ISchema[];
      console.log('items', items);

      expect(items[0].title).toEqual('修改后的项目1');
      expect(items[0].description).toEqual('修改后的项目1描述');
      expect(items[1].title).toEqual('修改后的项目2');
      expect(items[1].required).toEqual(false);
      expect(items[2].enum).toEqual(['x', 'y', 'z']);
      expect(items[2].default).toEqual('x');
    });

    it('应该正确处理用户配置对数组类型items的编辑', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'user-array-items-test',
        'x-edit-config': {
          items: [
            {
              allowKeys: ['title', 'description'],
            },
            {
              allowKeys: ['title', 'required'],
            },
          ],
          user: {
            items: [
              {
                allowKeys: ['userTitle'],
              },
              {
                allowKeys: ['userField'],
              },
            ],
          },
        },
        items: [
          {
            type: 'string',
            'x-id': 'user-item1-id',
            title: '用户项目1',
            description: '描述1',
            userTitle: '用户标题1',
          },
          {
            type: 'number',
            'x-id': 'user-item2-id',
            title: '用户项目2',
            required: true,
            userField: '用户字段2',
          },
        ],
      };

      // 系统级编辑内容
      const editContent: Record<string, ISchemaEditContent> = {
        'user-array-items-test': {
          items: [
            {
              keys: {
                title: {
                  type: 'edit',
                  value: '系统修改的项目1',
                },
              },
            },
            {
              keys: {
                title: {
                  type: 'edit',
                  value: '系统修改的项目2',
                },
              },
            },
          ],
        },
      };

      // 用户级编辑内容
      const userEditContent: Record<string, ISchemaEditContent> = {
        'user-array-items-test': {
          items: [
            {
              keys: {
                userTitle: {
                  type: 'edit',
                  value: '用户修改的标题1',
                },
              },
            },
            {
              keys: {
                userField: {
                  type: 'edit',
                  value: '用户修改的字段2',
                },
              },
            },
          ],
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent, userEditContent);

      // 验证系统级和用户级编辑是否都被正确应用
      const items = result.items as ISchema[];
      expect(items[0].title).toEqual('系统修改的项目1');
      expect((items[0] as Record<string, string>).userTitle).toEqual('用户修改的标题1');
      expect(items[1].title).toEqual('系统修改的项目2');
      expect((items[1] as Record<string, string>).userField).toEqual('用户修改的字段2');
    });

    it('应该正确处理单个对象类型的items配置和内容编辑', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'single-item-test',
        'x-edit-config': {
          items: {
            allowKeys: ['title', 'description', 'required'],
          },
        },
        items: {
          type: 'object',
          title: '单个项目',
          description: '这是一个单个对象类型的项目',
          required: false,
        },
      };

      const editContent: Record<string, ISchemaEditContent> = {
        'single-item-test': {
          items: {
            keys: {
              title: {
                type: 'edit',
                value: '修改后的单个项目',
              },
              description: {
                type: 'edit',
                value: '修改后的单个项目描述',
              },
              required: {
                type: 'edit',
                value: true,
              },
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent);

      // 验证单个对象类型的items是否被正确修改
      const items = result.items as ISchema;
      expect(items.title).toEqual('修改后的单个项目');
      expect(items.description).toEqual('修改后的单个项目描述');
      expect(items.required).toEqual(true);
    });

    it('应该正确处理用户配置对单个对象类型items的编辑', () => {
      const schema: ISchema = {
        type: 'array',
        'x-id': 'single-user-item-test',
        'x-edit-config': {
          items: {
            allowKeys: ['title', 'description'],
          },
          user: {
            items: {
              allowKeys: ['userField', 'customProp'],
            },
          },
        },
        items: {
          type: 'object',
          title: '用户单个项目',
          description: '用户单个对象类型项目描述',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          userField: '用户自定义字段',
          customProp: '自定义属性',
        },
      };

      // 系统级编辑内容
      const editContent: Record<string, ISchemaEditContent> = {
        'single-user-item-test': {
          items: {
            keys: {
              title: {
                type: 'edit',
                value: '系统修改的单个项目',
              },
              description: {
                type: 'edit',
                value: '系统修改的单个项目描述',
              },
            },
          },
        },
      };

      // 用户级编辑内容
      const userEditContent: Record<string, ISchemaEditContent> = {
        'single-user-item-test': {
          items: {
            keys: {
              userField: {
                type: 'edit',
                value: '用户修改的自定义字段',
              },
              customProp: {
                type: 'edit',
                value: '用户修改的自定义属性',
              },
            },
          },
        },
      };

      const result = mergeSchema(cloneDeep(schema), editContent, userEditContent);

      // 验证系统级和用户级编辑是否都被正确应用到单个对象类型的items上
      const items = result.items as ISchema;
      expect(items.title).toEqual('系统修改的单个项目');
      expect(items.description).toEqual('系统修改的单个项目描述');
      expect((items as Record<string, string>).userField).toEqual('用户修改的自定义字段');
      expect((items as Record<string, string>).customProp).toEqual('用户修改的自定义属性');
    });

    it('应该正确处理多层级的 schema 合并', () => {
      const schema: ISchema = {
        type: 'object',
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
