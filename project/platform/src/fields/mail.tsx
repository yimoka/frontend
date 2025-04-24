import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const MailField: IFieldConfig = {
  title: '邮箱',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
  },
  format: 'email',
  'x-column': {
    width: 150,
  },
  'x-output-schema': {
    type: 'string',
    'x-component': 'Text',
    'x-component-props': {
      children: '{{ $record.mail }}',
    },
  },
};

// 深度合并
export const getMailField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, MailField, conf);
