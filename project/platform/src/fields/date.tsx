import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const DateField: IFieldConfig = {
  type: 'number',
  'x-decorator': 'FormItem',
  'x-component': 'DatePicker',
  'x-component-props': {
    dataValueType: 'second',
    showTime: true,
  },
  'x-column': {
    width: 180,
    sorter: true,
  },
  'x-output-schema': {
    type: 'number',
    'x-component': 'DateText',
    'x-component-props': {
      withScopeValue: true,
    },
  },
};

export const getDateField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, DateField, conf);

export const getCreateTimeField = (conf: IFieldConfig = {}) => getDateField({ title: '创建时间', ...conf });

export const getUpdateTimeField = (conf: IFieldConfig = {}) => getDateField({ title: '更新时间', ...conf });
