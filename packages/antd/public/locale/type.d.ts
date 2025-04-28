import type { Locale as AntLocale } from 'antd/es/locale';

export type YimokaAntdLocale = {
  Common: { confirm: string; cancel: string; submit: string; reset: string },
  ListFilter: { query: string; reset: string },
  RecordDel: { popconfirmTitle: string; popconfirmDescription: string }
}

declare const localeValues: AntLocale & YimokaAntdLocale;
export default localeValues;

export type Locale = AntLocale & YimokaAntdLocale;