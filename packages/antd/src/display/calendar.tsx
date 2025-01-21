import { getDateValue, getPresetsDate, getPresetsDateRange, IDate, IDateType, IPresetsDateRange, toDayjs } from '@yimoka/shared';
import { Calendar as AntCalendar, GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';

type OldProps = GetProps<typeof AntCalendar>

export interface CalendarProps<T = IDate> extends Omit<OldProps, 'defaultValue' | 'value' | 'validRange' | 'onChange'> {
  valueType?: IDateType
  format?: string;
  defaultValue?: T
  value?: T;
  validRange?: IPresetsDateRange | OldProps['validRange'];
  onChange?: (value: T, date: Dayjs) => void;
}

export const Calendar = (props: CalendarProps) => {
  const { defaultValue, value, valueType, format, onChange, validRange, ...rest } = props;
  const curDefaultValue = defaultValue ? toDayjs(defaultValue, { type: valueType, format }) : undefined;
  const curValue = useMemo(() => (value ? toDayjs(value, { type: valueType, format }) : undefined), [value, valueType, format]);

  const curValidRange = useMemo(() => {
    if (validRange === undefined) return undefined;
    if (typeof validRange === 'string') return getPresetsDateRange(validRange);
    return validRange.map(item => (dayjs.isDayjs(item) ? item : getPresetsDate(item))) as [Dayjs, Dayjs];
  }, [validRange]);

  return (
    <AntCalendar
      {...rest}
      defaultValue={curDefaultValue}
      value={curValue}
      validRange={curValidRange}
      onChange={date => onChange?.(getDateValue(date, { type: valueType, format }), date)}
    />
  );
};
