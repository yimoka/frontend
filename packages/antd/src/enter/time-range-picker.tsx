import { useAdditionalNode, useSplitter } from '@yimoka/react';
import { isVacuous } from '@yimoka/shared';
import { TimePicker as AntTimePicker } from 'antd';
import { Dayjs } from 'dayjs';
import React, { ComponentProps, useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

import { toDayjsArray } from './date-picker-common';

export const TimeRangePicker = (props: TimeRangePickerProps) => {
  const {
    defaultValue, valueType, value, splitter, onChange, timeValueType = 'string', format,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    separator,
    ...rest
  } = props;
  const curSplitter = useSplitter(splitter);

  const curSeparator = useAdditionalNode('separator', separator);
  // 默认值不能使用 useMemo 否则无法第一次
  const curDefaultValue = toDayjsArray(defaultValue, curSplitter, timeValueType, format) as [Dayjs, Dayjs] | undefined;

  const curValue = useMemo(() => toDayjsArray(value, curSplitter, timeValueType, format) as [Dayjs, Dayjs] | undefined, [value, curSplitter, timeValueType, format]);

  const change: AntRangePickerProps['onChange'] = (dates, dateString) => {
    if (!onChange) {
      return;
    }
    if (timeValueType === 'dayjs') {
      onChange(dates, dates, dateString);
      return;
    }
    if (isVacuous(dates)) {
      onChange(valueType === 'string' ? '' : [], dates, dateString);
      return;
    }
    onChange(valueType === 'string' ? dateString.join(curSplitter) : dateString, dates, dateString);
  };

  return (
    <AntTimePicker.RangePicker
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      nextIcon={strToIcon(nextIcon)}
      prevIcon={strToIcon(prevIcon)}
      separator={curSeparator}
      suffixIcon={strToIcon(suffixIcon)}
      superNextIcon={strToIcon(superNextIcon)}
      superPrevIcon={strToIcon(superPrevIcon)}
      value={curValue}
      onChange={change}
    />
  );
};


type AntRangePickerProps = ComponentProps<typeof AntTimePicker.RangePicker>

export type TimeRangePickerProps = Omit<AntRangePickerProps, 'defaultValue' | 'value' | 'onChange'> & {
  value?: [Dayjs, Dayjs] | string
  defaultValue?: [Dayjs, Dayjs] | string
  onChange?: (value: [Dayjs | null, Dayjs | null] | null | [] | string | Array<string>, day: [Dayjs | null, Dayjs | null] | null, dateString: [string, string]) => void
  valueType?: 'string' | 'array'
  splitter?: string
  timeValueType?: 'string' | 'dayjs'
};
