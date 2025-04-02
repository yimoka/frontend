import { IFieldConfig } from '@yimoka/store';
import { merge } from 'lodash-es';
// const outSchema = {
//   type: 'boolean',
//   'x-component': 'KeyToVal',
//   'x-component-props': {
//     isTag: true,
//     options: { true: '是', false: '否' },
//     colors: { true: 'green', false: 'red' },
//   },
// };

export const BoolField: IFieldConfig = {
  type: 'boolean',
  'x-decorator': 'FormItem',
  'x-component': 'Switch',
  // column: {
  //   width: 70,
  //   autoFilter: true,
  //   filters: [{ text: '是', value: true }, { text: '否', value: false }],
  //   filterMultiple: false,
  //   schema: outSchema,
  // },
};

export const getBoolField = (conf: IFieldConfig = {}) => merge({}, BoolField, conf);
