import { useAdditionalNode, useSplitter } from '@yimoka/react';
import { IDate, IDateType, isVacuous, normalizeToArray } from '@yimoka/shared';
import { DatePicker as AntDatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import React, { ComponentProps, useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

import { toDayjsArray } from './date-picker-common';

export const DateRangePicker = (props: DateRangePickerProps) => {
  const {
    defaultValue, valueType, value, splitter, onChange, dataValueType, format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon, allowClear,
    separator,
    ...rest
  } = props;
  const curSplitter = useSplitter(splitter);

  const curSeparator = useAdditionalNode('separator', separator);
  // 默认值不能使用 useMemo 否则无法第一次
  const curDefaultValue = toDayjsArray(defaultValue, curSplitter, dataValueType, format, picker) as [Dayjs, Dayjs] | undefined;

  const curValue = useMemo(() => toDayjsArray(value, curSplitter, dataValueType, format, picker) as [Dayjs, Dayjs] | undefined, [value, curSplitter, dataValueType, format, picker]);

  const change: AntRangePickerProps['onChange'] = (dates, dateString) => {
    if (!onChange) {
      return;
    }
    if (dataValueType === 'dayjs') {
      onChange(dates, dates, dateString);
      return;
    }
    if (isVacuous(dates)) {
      onChange(valueType === 'string' ? '' : [], dates, dateString);
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
    onChange(valueType === 'string' ? arr.join(curSplitter) : arr, dates, dateString);
  };

  return (
    <AntDatePicker.RangePicker
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      defaultValue={curDefaultValue}
      format={format}
      nextIcon={strToIcon(nextIcon)}
      picker={picker}
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


type AntRangePickerProps = ComponentProps<typeof AntDatePicker.RangePicker>

export type DateRangePickerProps = Omit<AntRangePickerProps, 'defaultValue' | 'value' | 'onChange'> & {
  value?: [IDate, IDate] | string
  defaultValue?: [IDate, IDate] | string
  onChange?: (value: [IDate | null, IDate | null] | null | [] | string | Array<string | number>, day: [Dayjs | null, Dayjs | null] | null, dateString: [string, string]) => void
  valueType?: 'string' | 'array'
  splitter?: string
  dataValueType?: IDateType
};
