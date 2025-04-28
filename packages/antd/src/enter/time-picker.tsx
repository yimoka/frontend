import { useSplitter } from '@yimoka/react';
import { IAny, toDayjs } from '@yimoka/shared';
import { TimePicker as AntTimePicker, TimePickerProps as AntTimePickerProps } from 'antd';
import { Dayjs } from 'dayjs';
import React, { ComponentProps, useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

import { toDayjsArray, toFormat } from './date-picker-common';
import { TimeRangePicker } from './time-range-picker';

function TimePickerFC(props: TimePickerProps) {
  if (props.multiple) {
    return <TimePickerMultiple {...props} />;
  }
  return <TimePickerOne {...props} />;
}

function TimePickerOne(props: TimePickerOneProps) {
  const {
    defaultValue, value, onChange, timeValueType: timeValueType = 'string', format,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    ...rest
  } = props;

  // 默认值不能使用 useMemo 否则无法生效
  const curDefaultValue = toDayjs(defaultValue, { type: timeValueType, format: toFormat(format) });
  const curValue = useMemo(() => toDayjs(value, { type: timeValueType, format: toFormat(format) }), [value, timeValueType, format]);

  const change: AntTimePickerProps['onChange'] = (date, dateString) => {
    if (!date || timeValueType !== 'string') {
      onChange?.(date, date, dateString as string);
    } else {
      onChange?.(dateString as string, date, dateString as string);
    }
  };

  return (
    <AntTimePicker
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      multiple={false}
      nextIcon={strToIcon(nextIcon)}
      prevIcon={strToIcon(prevIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      superNextIcon={strToIcon(superNextIcon)}
      superPrevIcon={strToIcon(superPrevIcon)}
      value={curValue}
      onChange={change}
    />
  );
};

function TimePickerMultiple(props: TimePickerMultipleProps) {
  const {
    valueType, splitter, defaultValue, value, onChange, timeValueType: timeValueType, format,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    ...rest
  } = props;

  const curSplitter = useSplitter(splitter);

  // 默认值不能使用 useMemo 否则无法第一次
  const curDefaultValue = toDayjsArray(defaultValue, curSplitter, timeValueType, format) as IAny;

  const curValue = useMemo(() => toDayjsArray(value, curSplitter, timeValueType, format) as IAny, [value, curSplitter, timeValueType, format]);

  const change: IAny = (dates: Dayjs[], dateString: string[]) => {
    if (!onChange) {
      return;
    }
    if (timeValueType !== 'string') {
      onChange(dateString, dates, dateString);
      return;
    }
    onChange(dates, dates, dateString);
  };

  return (
    <AntTimePicker
      {...rest}
      multiple
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      nextIcon={strToIcon(nextIcon)}
      prevIcon={strToIcon(prevIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      superNextIcon={strToIcon(superNextIcon)}
      superPrevIcon={strToIcon(superPrevIcon)}
      value={curValue}
      onChange={change}
    />
  );
}

export type TimePickerBaseProps = Omit<ComponentProps<typeof AntTimePicker>, 'defaultValue' | 'value' | 'onChange' | 'multiple'> & { timeValueType?: 'string' | 'dayjs' }

type TimePickerOneProps = TimePickerBaseProps & {
  multiple?: false
  value?: string | Dayjs
  defaultValue?: string | Dayjs
  onChange?: (value: string | Dayjs, date: Dayjs, dateString: string) => void
}

type TimePickerMultipleProps = TimePickerBaseProps & {
  multiple: true
  value?: string[] | Dayjs[] | string
  defaultValue?: string[] | Dayjs[] | string
  onChange?: (value: string[] | Dayjs[] | string, day: Dayjs[] | null, dayString: string[]) => void
  valueType?: 'string' | 'array'
  splitter?: string
}

export type TimePickerProps = TimePickerOneProps | TimePickerMultipleProps


export const TimePicker = Object.assign(TimePickerFC, {
  RangePicker: TimeRangePicker,
}) as ITimePicker;


type ITimePicker = typeof TimePickerFC & {
  RangePicker: typeof TimeRangePicker;
};
