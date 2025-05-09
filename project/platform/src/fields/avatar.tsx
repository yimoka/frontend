import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const AvatarField: IFieldConfig = {
  type: 'string',
  title: '头像',
  'x-decorator': 'FormItem',
  'x-component': 'InImage',
  'x-component-props': {
    api: { url: '/base/iam/portal/getUploadCredential', params: { dir: '/avatar' } },
  },

  'x-output-schema': {
    'x-component': 'Avatar',
    'x-component-props': {
      withScopeValue: true,
    },
  },
};

export const getAvatarField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, AvatarField, conf);


