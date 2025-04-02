import { IFieldConfig } from '@yimoka/store';
import { merge } from 'lodash-es';

export const RemarkField: IFieldConfig = {
  title: '备注',
  'x-decorator': 'FormItem',
  'x-component': 'Input.TextArea',
};

// 深度合并
export const getRemarkField = (conf: IFieldConfig = {}) => merge({}, RemarkField, conf);
