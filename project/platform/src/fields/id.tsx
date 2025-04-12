import { mergeWithArrayOverride } from '@yimoka/shared';
import { IFieldConfig } from '@yimoka/store';

export const IDField: IFieldConfig = {
  title: 'ID',
  'x-column': {
    width: 140,
  },
};

// 深度合并
export const getIDField = (conf: IFieldConfig = {}) => mergeWithArrayOverride({}, IDField, conf);
