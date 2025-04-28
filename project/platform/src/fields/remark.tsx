import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const RemarkField: IFieldConfig = {
  title: '备注',
  'x-decorator': 'FormItem',
  'x-component': 'Input.TextArea',
};

// 深度合并
export const getRemarkField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, RemarkField, conf);
