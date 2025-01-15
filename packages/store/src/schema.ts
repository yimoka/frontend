import { ISchema as FISchema } from '@formily/json-schema';
import { IAny, IAnyObject, IObjKey } from '@yimoka/shared';

export declare type SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> = Record<string, ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>>;
export declare type SchemaItems<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> = ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message> | ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>[];

export declare type ISchema<Decorator = IAny, Component = IAny, DecoratorProps = IAny, ComponentProps = IAny, Pattern = IAny, Display = IAny, Validator = IAny, Message = IAny, ReactionField = IAny> = FISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message, ReactionField> & {
  definitions?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  properties?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  items?: SchemaItems<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  additionalItems?: ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  patternProperties?: SchemaProperties<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  additionalProperties?: ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  // 分割符 当使用字符串表示数组时使用
  'x-splitter'?: string;
  // 字段的提示
  'x-tooltip'?: string | IAnyObject;
  // 当在列表页表格渲染时使用
  // 'x-column'?: IAnyObject & { key?: IObjKey, width?: number | string }
  // 用于渲染组件属性的 schema 很多组件属性是一个 ReactNode 可以使用这个属性
  'x-additional-schema'?: Record<IObjKey, ISchema>
  // 唯一标识字段 用于在多级系统时用于编辑时的数据匹配
  'x-id'?: string
  // 编辑编辑 允许租户或用户编辑的的配置 用于改变 schema 以达到不同租户/用户的不同需求 例如 表格的列配置
  'x-edit-config'?: IAnyObject
}
