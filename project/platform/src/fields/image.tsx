import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const ImageField: IFieldConfig = {
  type: 'string',
  title: '图片',
  'x-decorator': 'FormItem',
  'x-component': 'InImage',
  'x-component-props': {
    api: { url: '/base/iam/portal/getUploadCredential' },
  },

  'x-output-schema': {
    'x-component': 'Image',
    'x-component-props': {
      withScopeValue: true,
    },
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


