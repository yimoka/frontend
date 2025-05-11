import type { Locale as AntLocale } from 'antd/es/locale';

export type YimokaAntdLocale = {
  Common: { confirm: string; cancel: string; submit: string; reset: string },
  ListFilter: { query: string; reset: string },
  RecordDel: { popconfirmTitle: string; popconfirmDescription: string, text: string }
  RecordEnable: { popconfirmTitle: string; text: string }
  RecordDisable: { popconfirmTitle: string; text: string }
  RecordBatchDel: { popconfirmTitle: string; popconfirmDescription: string, text: string }
  RecordBatchEnable: { popconfirmTitle: string; text: string }
  RecordBatchDisable: { popconfirmTitle: string; text: string }
}

declare const localeValues: AntLocale & YimokaAntdLocale;
export default localeValues;

export type Locale = AntLocale & YimokaAntdLocale;
