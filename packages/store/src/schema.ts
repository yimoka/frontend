/**
 * @remarks 模式定义模块，提供表单和字段的模式定义功能
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { ISchema as FISchema } from '@formily/json-schema';
import { IAny, IAnyObject, IObjKey, isVacuous, mergeWithArrayOverride } from '@yimoka/shared';
import { get, omit, set } from 'lodash-es';

export const mergeSchema = (schema: ISchema, editContentMap?:ISchemaEditContentMap, userEditContentMap?: ISchemaEditContentMap) => {
  if (isVacuous(schema)) return schema;
  // 获取 ids 和其所在的路径
  const idPathMap: Record<string, string> = {};
  // 判断是否存在重复项 如果存在则抛出异常 并不进行处理
  // eslint-disable-next-line complexity
  const findIdPath = (schema: ISchema, path = '') => {
    const id = schema['x-id'];
    if (id) {
      if (idPathMap[id]) {
        return true;
      }
      idPathMap[id] = path;
    }
    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        const curPath = `properties.${key}`;
        if (findIdPath(value, path ? `${path}.${curPath}` : curPath)) {
          return true;
        }
      }
    }
    if (schema.items) {
      if (Array.isArray(schema.items)) {
        for (let i = 0; i < schema.items.length; i++) {
          const item = schema.items[i];
          const curPath = `items[${i}]`;
          if (typeof item === 'object' && findIdPath(item as ISchema, path ? `${path}.${curPath}` : curPath)) {
            return true;
          }
        }
      } else if (typeof schema.items === 'object') {
        const curPath = 'items';
        if (findIdPath(schema.items as ISchema, path ? `${path}.${curPath}` : curPath)) {
          return true;
        }
      }
    }
    return false;
  };
  // 如果存在重复项则返回原 schema
  if (findIdPath(schema)) return schema;
  // 如果 idPathMap 为空则返回原 schema
  if (isVacuous(idPathMap)) return schema;

  // 通过 idPathMap 来进行修复 按优先级,有可能父级的修改已经删除了子级 如通过 path取不到 则跳过
  let curSchema = { ...schema };
  Object.entries(idPathMap).forEach(([id, path]) => {
    const editContent = editContentMap?.[id];
    const userEditContent = userEditContentMap?.[id];
    if (path === '' && id) {
      curSchema = mergeEditContent(curSchema, editContent, userEditContent);
    } else {
      const pathSchema = get(curSchema, path);
      if (!pathSchema) return;
      curSchema = set(curSchema, path, mergeEditContent(pathSchema, editContent, userEditContent));
    }
  });
  return curSchema;
};

// eslint-disable-next-line complexity
const mergeEditContent = (schema: ISchema, editContent?: ISchemaEditContent, userEditContent?: ISchemaEditContent) => {
  if (isVacuous(editContent) && isVacuous(userEditContent)) return schema;
  if (isVacuous(schema)) return schema;
  const { 'x-edit-config': editConfig } = schema;
  if (isVacuous(editConfig)) {
    return schema;
  }
  let curSchema = schema;
  // 合并配置
  curSchema = mergeSchemaContent(curSchema, editConfig, editContent);
  // 合并用户配置
  curSchema = mergeSchemaContent(curSchema, editConfig?.user, userEditContent);
  // 合并 properties 配置
  curSchema.properties = mergeSchemaContent(curSchema.properties, editConfig?.properties, editContent?.properties);
  curSchema.properties = mergeSchemaContent(curSchema.properties, editConfig?.user?.properties, userEditContent?.properties);
  // 合并 items 配置
  const itemsConfig = editConfig?.items;
  const itemsUserConfig = editConfig?.user?.items;
  const itemsContent = editContent?.items;
  const userItemsContent = userEditContent?.items;
  if (Array.isArray(curSchema.items)) {
    if (Array.isArray(itemsConfig)) {
      if (itemsContent && Array.isArray(itemsContent)) {
        curSchema.items = curSchema.items.map((item, index) => mergeSchemaContent(item, itemsConfig[index], itemsContent[index])) as IAnyObject[];
      }
      if (Array.isArray(itemsUserConfig)) {
        if (userItemsContent && Array.isArray(userItemsContent)) {
          curSchema.items = curSchema.items?.map((item, index) => mergeSchemaContent(item, itemsUserConfig[index], userItemsContent[index])) as IAnyObject[];
        }
      }
    }
  } else if (!isVacuous(curSchema.items)) {
    if (!Array.isArray(itemsConfig) && !Array.isArray(itemsContent)) {
      curSchema.items = mergeSchemaContent(curSchema.items, itemsConfig, itemsContent);
    }
    if (!Array.isArray(itemsUserConfig) && !Array.isArray(userItemsContent)) {
      curSchema.items = mergeSchemaContent(curSchema.items, itemsUserConfig, userItemsContent);
    }
  }
  return curSchema;
};

// 类型守卫函数
const isAllowedKey = (key: string, allowKeys: string[] | boolean | undefined): boolean => {
  if (allowKeys === true) return true;
  if (Array.isArray(allowKeys)) return allowKeys.includes(key);
  return false;
};

const isDeniedKey = (key: string, denyKeys: string[] | boolean | undefined): boolean => {
  if (denyKeys === true) return true;
  if (Array.isArray(denyKeys)) return denyKeys.includes(key);
  return false;
};

interface IEditValue {
  type: 'edit' | 'del';
  value?: IAnyObject;
}

const handleEditOperation = (key: string, value: IEditValue, allowKeys: string[] | boolean | undefined, denyKeys: string[] | boolean | undefined): IAnyObject | undefined => {
  if (value?.type === 'edit' && isAllowedKey(key, allowKeys) && !isDeniedKey(key, denyKeys)) {
    return value.value;
  }
  return undefined;
};

const handleDeleteOperation = (key: string, value: IEditValue, allowDel: string[] | boolean | undefined): boolean => value?.type === 'del' && isAllowedKey(key, allowDel);

const handleAddOperation = <T extends IAnyObject | undefined>(obj: T, addKeys: Array<{ key: string; value: IAnyObject }> | undefined, allowAdd: boolean | undefined): T => {
  if (!isVacuous(addKeys) && allowAdd === true && obj) {
    const result = { ...obj };
    addKeys.forEach(({ key, value }) => {
      if (!(key in result)) {
        result[key] = value;
      }
    });
    return result as T;
  }
  return obj;
};

const handleSortOperation = <T extends IAnyObject | undefined>(obj: T, sort: string[] | undefined, allowSort: string[] | boolean | undefined): T => {
  if (allowSort === true && !isVacuous(sort) && obj) {
    const result = { ...obj };
    sort.forEach((key, index) => {
      if (key in result) {
        result[key] = { ...result[key], 'x-index': index };
      }
    });
    return result as T;
  }
  return obj;
};

export const mergeSchemaContent = <T extends IAnyObject | undefined>(obj: T, editConfig?: ISchemaEditConfigItem, editContent?: ISchemaEditContentItem): T => {
  if (isVacuous(editConfig) || isVacuous(editContent)) return obj;
  const { allowAdd, allowDel, allowSort, allowKeys, denyKeys } = editConfig;
  const { keys, sort, addKeys } = editContent;

  let curObj = obj;
  const useObject: IAnyObject = {};
  const delKeys: string[] = [];

  // 处理编辑和删除操作
  if (keys) {
    Object.entries(keys).forEach(([key, value]) => {
      const editValue = handleEditOperation(key, value as IEditValue, allowKeys, denyKeys);
      if (useObject[key] !== editValue) {
        useObject[key] = editValue;
      }
      if (handleDeleteOperation(key, value as IEditValue, allowDel)) {
        delKeys.push(key);
      }
    });
  }

  // 处理添加操作
  curObj = handleAddOperation(curObj, addKeys, allowAdd);

  // 处理编辑操作的结果
  if (!isVacuous(useObject)) {
    curObj = mergeWithArrayOverride({}, curObj, useObject) as T;
  }

  // 处理删除操作
  if (!isVacuous(delKeys)) {
    curObj = omit(curObj, delKeys) as T;
  }

  // 处理排序操作
  curObj = handleSortOperation(curObj, sort, allowSort);

  return curObj;
};

/**
 * 模式属性类型
 * @template Decorator - 装饰器类型
 * @template Component - 组件类型
 * @template DecoratorProps - 装饰器属性类型
 * @template ComponentProps - 组件属性类型
 * @template Pattern - 模式类型
 * @template Display - 显示类型
 * @template Validator - 验证器类型
 * @template Message - 消息类型
 * @remarks 定义模式属性的键值对映射
 */
export declare type SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> = Record<string, ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>>;

/**
 * 模式项类型
 * @template Decorator - 装饰器类型
 * @template Component - 组件类型
 * @template DecoratorProps - 装饰器属性类型
 * @template ComponentProps - 组件属性类型
 * @template Pattern - 模式类型
 * @template Display - 显示类型
 * @template Validator - 验证器类型
 * @template Message - 消息类型
 * @remarks 定义模式项，可以是单个模式或模式数组
 */
export declare type SchemaItems<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> = ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> | ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>[];

/**
 * 模式接口
 * @template Decorator - 装饰器类型
 * @template Component - 组件类型
 * @template DecoratorProps - 装饰器属性类型
 * @template ComponentProps - 组件属性类型
 * @template Pattern - 模式类型
 * @template Display - 显示类型
 * @template Validator - 验证器类型
 * @template Message - 消息类型
 * @template ReactionField - 响应字段类型
 * @remarks 扩展 Formily 的模式定义，添加自定义属性
 * @example
 * ```ts
 * const schema: ISchema = {
 *   type: 'object',
 *   properties: {
 *     name: {
 *       type: 'string',
 *       'x-splitter': ',',
 *       'x-tooltip': '请输入姓名'
 *     }
 *   }
 * };
 * ```
 */
export declare type ISchema<Decorator = IAny, Component = IAny, DecoratorProps = IAny, ComponentProps = IAny, Pattern = IAny, Display = IAny, Validator = IAny, Message = IAny, ReactionField = IAny> = FISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message, ReactionField> & {
  /** 定义对象 */
  definitions?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 属性对象 */
  properties?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 数组项 */
  items?: SchemaItems<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 额外数组项 */
  additionalItems?: ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 模式属性 */
  patternProperties?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 额外属性 */
  additionalProperties?: ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  /** 分割符，用于将字符串转换为数组 */
  'x-splitter'?: string;
  /** 字段提示信息 */
  'x-tooltip'?: ITooltip;
  /** 用于渲染组件属性的模式 */
  'x-additional-schema'?: Record<IObjKey, ISchema>;
  /** 唯一标识字段，用于多级系统编辑时的数据匹配 */
  'x-id'?: string;
  /** 编辑配置，用于实现租户/用户自定义配置 */
  'x-edit-config'?: ISchemaEditConfig;
}

export type ITooltip = string | IAnyObject | boolean | null | number


export type ISchemaEditConfig = ISchemaEditConfigItem & {
  /** 允许修改的属性,数组展示或 true 为所有属性，其中 properties 和 items 单独配置  */
  properties?: ISchemaEditConfigItem;
  items?: ISchemaEditConfigItem | ISchemaEditConfigItem[];
  // 用户私有配置
  user?: ISchemaEditConfig;
}

export type ISchemaEditConfigItem = {
  /** 允许修改的属性,数组展示或 true 为所有属性 */
  allowKeys?: string[] | boolean;
  /** 不允许修改的属性,数组展示或 true 为所有属性 */
  denyKeys?: string[] | boolean;
  /** 是否允许删除 */
  allowDel?: string[] | boolean;
  /** 是否允许添加 */
  allowAdd?: boolean;
  /** 是否允许排序 */
  allowSort?: string[] | boolean;
}

export type ISchemaEditContentMap = { [id: string]: ISchemaEditContent };

// 编辑配置的内容
export type ISchemaEditContent = ISchemaEditContentItem & {
  properties?: ISchemaEditContentItem;
  items?: ISchemaEditContentItem | ISchemaEditContentItem[];
}

export type ISchemaEditContentItem = {
  keys?: {
    [key: string]: {
      type: 'del' | 'edit'
      /** 值 */
      value?: IAny;
    }
  }
  /** 排序 */
  sort?: string[];
  /** 添加 */
  addKeys?: Array<{
    key: string;
    value: IAnyObject;
  }>
}


