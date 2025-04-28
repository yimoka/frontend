import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const ImageField: IFieldConfig = {
  type: 'string',
  title: '图片',
  'x-decorator': 'FormItem',
  'x-component': 'Image',
  'x-component-props': { isEdit: true },
  'x-column': {
    schema: {
      'x-component': 'Image',
      'x-component-props': {
        // isEdit: false,
        // isModal: true,
      },
    },
  },
  'x-output-schema': {
    'x-component': 'Image',
  },
};

export const getImageField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, ImageField, conf);

export const ImageModalField: IFieldConfig = {
  type: 'string',
  title: '图片',
  'x-decorator-props': { width: 110 },
  'x-component': 'Image',
  'x-component-props': {
    isEdit: true,
    isModal: true,
  },
};

export const getImageModalField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, ImageModalField, conf);
