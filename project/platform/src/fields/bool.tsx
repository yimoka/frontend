import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const BoolField: IFieldConfig = {
  title: '是/否',
  type: 'boolean',
  'x-decorator': 'FormItem',
  'x-component': 'Switch',
  'x-output-schema': {
    type: 'boolean',
    'x-component': 'ValueLabel',
    'x-component-props': {
      withScopeValue: true,
      isTag: true,
      options: { true: '是', false: '否' },
      colors: { true: 'green', false: 'red' },
    },
  },
  'x-column': {
    width: 70,
    autoFilter: true,
    filters: [{ text: '是', value: true }, { text: '否', value: false }],
    filterMultiple: false,
  },
};

export const getBoolField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, BoolField, conf);
