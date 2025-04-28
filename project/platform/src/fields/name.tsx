import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const NameField: IFieldConfig = {
  title: '名称',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
  },
  // 'x-output-schema': {
  //   type: 'string',
  //   'x-component': 'Text',
  //   'x-component-props': {
  //     withScopeValue: true,
  //   },
  // },
};

// 深度合并
export const getNameField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, NameField, conf);

export const RealNameField: IFieldConfig = {
  title: '真实姓名',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
  },
  'x-column': { width: 130 },
  // 'x-output-schema': {
  //   type: 'string',
  //   'x-component': 'Text',
  //   'x-component-props': {
  //     withScopeValue: true,
  //   },
  // },
};
export const getRealNameField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, RealNameField, conf);
