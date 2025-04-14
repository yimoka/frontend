import { useSplitter } from '@yimoka/react';
import { IDate, IDateType, isVacuous, normalizeToArray, toDayjs } from '@yimoka/shared';
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';
import React, { ComponentProps, useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

import { toDayjsArray, toFormat } from './date-picker-common';
import { DateRangePicker } from './date-range-picker';

function DatePickerFC(props: DatePickerProps) {
  if (props.multiple) {
    return <DatePickerMultiple {...props} />;
  }
  return <DatePickerOne {...props} />;
}

function DatePickerOne(props: DatePickerOneProps) {
  const {
    defaultValue, value, onChange, dataValueType = 'ms', format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    ...rest
  } = props;

  // 默认值不能使用 useMemo 否则无法生效
  const curDefaultValue = toDayjs(defaultValue, { type: dataValueType, format: toFormat(format, picker) });
  const curValue = useMemo(() => toDayjs(value, { type: dataValueType, format: toFormat(format, picker) }), [value, dataValueType, format, picker]);

  const change: AntDatePickerProps['onChange'] = (date, dateString) => {
    if (!date) {
      onChange?.(dateString as IDate, date, dateString as string);
    } else if (dataValueType === 'dayjs') {
      onChange?.(date, date, dateString as string);
    } else if (dataValueType === 's') {
      onChange?.(date.unix(), date, dateString as string);
    } else if (dataValueType === 'ms') {
      onChange?.(date.valueOf(), date, dateString as string);
    } else {
      onChange?.(dateString as IDate, date, dateString as string);
    }
  };

  return (
    <AntDatePicker
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      multiple={false}
      nextIcon={strToIcon(nextIcon)}
      picker={picker}
      prevIcon={strToIcon(prevIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      superNextIcon={strToIcon(superNextIcon)}
      superPrevIcon={strToIcon(superPrevIcon)}
      value={curValue}
      onChange={change}
    />
  );
};

function DatePickerMultiple(props: DatePickerMultipleProps) {
  const {
    valueType, splitter, defaultValue, value, onChange, dataValueType = 'ms', format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    ...rest
  } = props;

  const curSplitter = useSplitter(splitter);

  // 默认值不能使用 useMemo 否则无法第一次
  const curDefaultValue = toDayjsArray(defaultValue, curSplitter, dataValueType, format, picker);

  const curValue = useMemo(() => toDayjsArray(value, curSplitter, dataValueType, format, picker), [value, curSplitter, dataValueType, format, picker]);

  const change: AntDatePickerProps<Dayjs[]>['onChange'] = (dates, dateString) => {
    if (!onChange) {
      return;
    }
    if (dataValueType === 'dayjs') {
      onChange(dates, dates, dateString as string[]);
      return;
    }
    if (isVacuous(dates)) {
      onChange(valueType === 'string' ? '' : [], dates, dateString as string[]);
      return;
    }

    let arr: Array<string | number> = [];
    if (dataValueType === 's') {
      arr = dates.map(item => item?.unix() ?? '');
    } else if (dataValueType === 'ms') {
      arr = dates.map(item => item?.valueOf() ?? '');
    } else {
      arr = normalizeToArray(dateString);
    }
    arr = arr.filter(Boolean);
    onChange(valueType === 'string' ? arr.join(curSplitter) : arr, dates, dateString as string[]);
  };

  return (
    <AntDatePicker<Dayjs[]>
      {...rest}
      multiple
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      nextIcon={strToIcon(nextIcon)}
      picker={picker}
      prevIcon={strToIcon(prevIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      superNextIcon={strToIcon(superNextIcon)}
      superPrevIcon={strToIcon(superPrevIcon)}
      value={curValue}
      onChange={change}
    />
  );
}


export type DatePickerBaseProps = Omit<ComponentProps<typeof AntDatePicker>, 'defaultValue' | 'value' | 'onChange' | 'multiple'> & { dataValueType?: IDateType }

type DatePickerOneProps = DatePickerBaseProps & {
  multiple?: false
  value?: IDate
  defaultValue?: IDate
  onChange?: (value: IDate, day: Dayjs | null, dateString: string) => void
}

type DatePickerMultipleProps = DatePickerBaseProps & {
  multiple: true
  value?: IDate[] | string
  defaultValue?: IDate[] | string
  onChange?: (value: IDate[] | string, day: Dayjs[] | null, dateString: string[]) => void
  valueType?: 'string' | 'array'
  splitter?: string
}

export type DatePickerProps = DatePickerOneProps | DatePickerMultipleProps


export const DatePicker = Object.assign(DatePickerFC, {
  RangePicker: DateRangePicker,
  WeekPicker: AntDatePicker.WeekPicker,
  MonthPicker: AntDatePicker.MonthPicker,
  QuarterPicker: AntDatePicker.QuarterPicker,
  YearPicker: AntDatePicker.YearPicker,
  TimePicker: AntDatePicker.TimePicker,
}) as IDatePicker;


type IDatePicker = typeof DatePickerFC & {
  RangePicker: typeof DateRangePicker;
  WeekPicker: typeof AntDatePicker.WeekPicker;
  MonthPicker: typeof AntDatePicker.MonthPicker;
  QuarterPicker: typeof AntDatePicker.QuarterPicker;
  YearPicker: typeof AntDatePicker.YearPicker;
  TimePicker: typeof AntDatePicker.TimePicker;
};
