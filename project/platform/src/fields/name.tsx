import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const NameField: IFieldConfig = {
  title: '名称',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
};

// 深度合并
export const getNameField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, NameField, conf);
