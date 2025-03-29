/**
 * @remarks 模式定义模块，提供表单和字段的模式定义功能
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { ISchema as FISchema } from '@formily/json-schema';
import { IAny, IAnyObject, IObjKey } from '@yimoka/shared';

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
  'x-tooltip'?: string | IAnyObject;
  /** 表格列配置（已注释） */
  // 'x-column'?: IAnyObject & { key?: IObjKey, width?: number | string }
  /** 用于渲染组件属性的模式 */
  'x-additional-schema'?: Record<IObjKey, ISchema>;
  /** 唯一标识字段，用于多级系统编辑时的数据匹配 */
  'x-id'?: string;
  /** 编辑配置，用于实现租户/用户自定义配置 */
  'x-edit-config'?: IAnyObject;
}
