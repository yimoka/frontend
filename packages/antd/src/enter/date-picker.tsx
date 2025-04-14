import { useSplitter } from '@yimoka/react';
import { IDate, IDateType, isVacuous, normalizeToArray, toDayjs } from '@yimoka/shared';
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { ComponentProps, useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

export type DatePickerBaseProps = Omit<ComponentProps<typeof AntDatePicker>, 'defaultValue' | 'value' | 'onChange' | 'multiple'> & { dataValueType?: IDateType }

type DatePickerOneProps = DatePickerBaseProps & {
  multiple?: false
  value?: IDate
  defaultValue?: IDate
  onChange?: (value: IDate, day: Dayjs | null) => void
}

type DatePickerMultipleProps = DatePickerBaseProps & {
  multiple: true
  value?: IDate[] | string
  defaultValue?: IDate[] | string
  onChange?: (value: IDate[] | string, day: Dayjs[] | null) => void
  valueType?: 'string' | 'array'
  splitter?: string
}

export type DatePickerProps = DatePickerOneProps | DatePickerMultipleProps

function DatePickerFC(props: DatePickerProps) {
  if (props.multiple) {
    return <DatePickerMultiple {...props} />;
  }
  return <DatePickerOne {...props} />;
}

function DatePickerOne(props: DatePickerOneProps) {
  const {
    defaultValue, value, onChange, dataValueType: dataValueType, format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    ...rest
  } = props;

  // 默认值不能使用 useMemo 否则无法第一次
  const curDefaultValue = toDayjs(defaultValue, { type: dataValueType, format: toFormat(format, picker) });
  const curValue = useMemo(() => toDayjs(value, { type: dataValueType, format: toFormat(format, picker) }), [value, dataValueType, format, picker]);

  const change: AntDatePickerProps['onChange'] = (date, dateString) => {
    if (!date) {
      onChange?.(dateString as IDate, date);
    } else if (dataValueType === 'dayjs') {
      onChange?.(date, date);
    } else if (dataValueType === 's') {
      onChange?.(date.unix(), date);
    } else if (dataValueType === 'ms') {
      onChange?.(date.valueOf(), date);
    } else {
      onChange?.(dateString as IDate, date);
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

const toDayjsArray = (value: IDate[] | string | undefined, splitter: string, dataValueType: IDateType = 'string', format: DatePickerProps['format'], picker: DatePickerProps['picker']): Dayjs[] | undefined => {
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

function DatePickerMultiple(props: DatePickerMultipleProps) {
  const {
    valueType, splitter, defaultValue, value, onChange, dataValueType: dataValueType, format, picker,
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
      onChange(dates, dates);
      return;
    }
    if (isVacuous(dates)) {
      onChange(valueType === 'string' ? '' : [], dates);
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
    onChange(valueType === 'string' ? arr.join(curSplitter) : arr, dates);
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

// eslint-disable-next-line complexity
const toFormat = (format: DatePickerProps['format'], picker: DatePickerProps['picker']): string => {
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

// type AntRangePickerProps = Omit<RangePickerBaseProps<IAny>, 'defaultValue' | 'value' | 'onChange'> | Omit<RangePickerDateProps<IAny>, 'defaultValue' | 'value' | 'onChange'> | Omit<RangePickerTimeProps<IAny>, 'defaultValue' | 'value' | 'onChange'>;
// export type RangePickerProps<T = string> = AntRangePickerProps & {
//   value?: T[] | string // 两个日期支持 2000-01-01,2000-01-01 或者 [2000-01-01,2000-01-01]
//   defaultValue?: T[] | string
//   splitter?: string;
//   valueType?: 'string' | 'array';
//   onChange?: (value: T[] | string, day: (Dayjs | null)[] | null) => void
//   // 时间值类型 字符串 秒 毫秒 dayjs
//   dataValueType?: 'string' | 'second' | 'millisecond' | 'dayjs'
// };


// const RangePicker: <T = string>(props: RangePickerProps<T>) => IAny = (props: RangePickerProps<IAny>) => {
//   const {
//     defaultValue, valueType, value, splitter = ',', onChange, dataValueType, format, picker,
//     nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
//     separator,
//     ...rest
//   } = props;

//   const curSeparator = useAdditionalNode('separator', separator);

//   const curDefaultValue = valueToDayjsRange(defaultValue, splitter, dataValueType, format as OptionType, picker);

//   const newProps = useMemo(() => {
//     const obj: Pick<RangePickerBaseProps<IAny>, 'value' | 'onChange'> = {};
//     if (value !== undefined) {
//       obj.value = valueToDayjsRange(value, splitter, dataValueType, format as OptionType, picker);
//     }
//     if (onChange) {
//       obj.onChange = (dates, dateStrings) => {
//         let v: IAny[] = [];
//         if (!dates) {
//         } else if (dataValueType === 'dayjs') {
//           v = dates;
//         } else if (dataValueType === 'second') {
//           v = dates.map(item => item?.unix() ?? '');
//         } else if (dataValueType === 'millisecond') {
//           v = dates.map(item => item?.valueOf() ?? '');
//         } else {
//           v = dateStrings;
//         }
//         onChange(valueType === 'string' ? v.join(splitter) : v, dates);
//       };
//     }
//     return obj;
//   }, [value, onChange, splitter, dataValueType, format, picker, valueType]);

//   return (
//     <AntDatePicker.RangePicker
//       {...rest}
//       allowClear={handleAllowClear(allowClear)}
//       defaultValue={curDefaultValue}
//       format={format}
//       nextIcon={strToIcon(nextIcon)}
//       picker={picker}
//       prevIcon={strToIcon(prevIcon)}
//       separator={curSeparator}
//       suffixIcon={strToIcon(suffixIcon)}
//       superNextIcon={strToIcon(superNextIcon)}
//       superPrevIcon={strToIcon(superPrevIcon)}
//       {...newProps}
//     />
//   );
// };


export const DatePicker = Object.assign(DatePickerFC, {
  // RangePicker,
  WeekPicker: AntDatePicker.WeekPicker,
  MonthPicker: AntDatePicker.MonthPicker,
  QuarterPicker: AntDatePicker.QuarterPicker,
  YearPicker: AntDatePicker.YearPicker,
  TimePicker: AntDatePicker.TimePicker,
}) as IDatePicker;


type IDatePicker = typeof DatePickerFC & {
  // RangePicker: typeof RangePicker;
  WeekPicker: typeof AntDatePicker.WeekPicker;
  MonthPicker: typeof AntDatePicker.MonthPicker;
  QuarterPicker: typeof AntDatePicker.QuarterPicker;
  YearPicker: typeof AntDatePicker.YearPicker;
  TimePicker: typeof AntDatePicker.TimePicker;
};
