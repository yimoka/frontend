import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const PasswordField: IFieldConfig = {
  title: '密码',
  minLength: 8,
  maxLength: 32,
  'x-component': 'Input.Password',
  'x-component-props': {
    allowClear: true,
  },
  'x-decorator': 'FormItem',
  'x-column': { width: 180 },
};

export const getPasswordField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, PasswordField, conf);
