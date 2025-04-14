import { IDate, IDateType, isVacuous, toDayjs } from '@yimoka/shared';
import dayjs, { Dayjs } from 'dayjs';

import { DatePickerProps } from './date-picker';

export const toDayjsArray = (value: IDate[] | string | undefined, splitter: string, dataValueType: IDateType = 'string', format: DatePickerProps['format'], picker: DatePickerProps['picker']): Dayjs[] | undefined => {
  if (typeof value === 'undefined') {
    return undefined;
  }
  const arr = typeof value === 'string' ? value.split(splitter) : value;
  if (!Array.isArray(arr)) {
    return undefined;
  }
  const formatStr = toFormat(format, picker);
  return arr.map(item => toDayjs(item, { type: dataValueType, format: formatStr }))?.filter(Boolean) as Dayjs[];
};

// eslint-disable-next-line complexity
export const toFormat = (format: DatePickerProps['format'], picker: DatePickerProps['picker']): string => {
  if (isVacuous(format)) {
    if (picker === 'week') {
      return 'YYYY-WW';
    }
    if (picker === 'month') {
      return 'YYYY-MM';
    }
    if (picker === 'quarter') {
      return 'YYYY-Q';
    }
    if (picker === 'year') {
      return 'YYYY';
    }
    if (picker === 'time') {
      return 'HH:mm:ss';
    }
    return '';
  }
  if (typeof format === 'string') {
    return format;
  }
  if (Array.isArray(format)) {
    const item = format[0];
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'function') {
      return item(dayjs());
    }
    return item;
  }
  if (typeof format === 'object') {
    return format.format;
  }
  return '';
};
