import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const PhoneField: IFieldConfig = {
  title: '手机号码',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
  },
  format: 'phone',
  'x-column': {
    width: 150,
  },
  'x-output-schema': {
    type: 'string',
    'x-component': 'Text',
    'x-component-props': {
      withScopeValue: true,
    },
  },
};
// 深度合并
export const getPhoneField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, PhoneField, conf);


export const PhonePrefixField: IFieldConfig = {
  title: '区号',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
    maxLength: 3,
    prefix: '+',
  },
  'x-column': {
    width: 60,
  },
  'x-output-schema': {
    type: 'string',
    'x-component': 'Text',
    'x-component-props': {
      children: '{{ $record.phonePrefix }}',
    },
  },
};

export const getPhonePrefixField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, PhonePrefixField, conf);
