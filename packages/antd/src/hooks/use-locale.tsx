import { mergeWithArrayOverride } from '@yimoka/shared';
import { ConfigProvider } from 'antd';
import { useContext } from 'react';

import { Locale } from '../../public/locale/type';

const defaultLocale: Locale = {
  locale: 'en_US',
  Common: { confirm: 'Confirm', cancel: 'Cancel', submit: 'Submit', reset: 'Reset' },
  ListFilter: { query: 'Query', reset: 'Reset' },
  RecordDel: { popconfirmTitle: 'Are you sure to delete?', popconfirmDescription: 'This action cannot be undone' },
};

export const useLocaleComponent = <T extends keyof Locale>(component: T) => {
  const context = useContext(ConfigProvider.ConfigContext);
  const locale = context.locale as Locale;
  return mergeWithArrayOverride({}, defaultLocale[component], locale[component]) as (Required<Locale>[T]);
};
