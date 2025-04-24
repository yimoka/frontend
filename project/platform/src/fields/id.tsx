import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const IDField: IFieldConfig = {
  title: 'ID',
  type: 'string',
  'x-decorator': 'FormItem',
  'x-component': 'Input',
  'x-component-props': {
    allowClear: true,
  },
  'x-column': {
    width: 140,
  },
  'x-output-schema': {
    type: 'string',
    'x-component': 'Text',
    'x-component-props': {
      children: '{{ $record.id }}',
    },
  },
};

// 深度合并
export const getIDField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, IDField, conf);
