import { useSplitter } from '@yimoka/react';
import { IDate, IDateType, isVacuous, normalizeToArray } from '@yimoka/shared';
import { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';

import { Text, TextProps } from '../base/typography';
import { toDayjsArray } from '../enter/date-picker-common';

export type DateTextProps = TextProps & {
  date?: IDate | IDate[]
  value?: IDate | IDate[]
  timestamp?: 'ms' | 's',
  format?: string,
  valFormat?: string,
  splitter?: string,
}

const dfFormat = 'YYYY-MM-DD HH:mm:ss';

export const DateText = (props: DateTextProps) => {
  const { date, value, timestamp = 's', format = dfFormat, valFormat = dfFormat, splitter, ...rest } = props;
  const curSplitter = useSplitter(splitter);
  const curValue = useMemo(() => {
    const dateVal = date ?? value;
    if (isVacuous(dateVal)) {
      return null;
    }

    let type: IDateType = 'string';
    if (typeof dateVal === 'number') {
      type = timestamp;
    }
    if (typeof dateVal === 'string') {
      type = 'string';
    }
    if (dateVal instanceof Date) {
      type = 'date';
    }
    if (dateVal instanceof Dayjs) {
      type = 'dayjs';
    }

    const dayjsVal = toDayjsArray(normalizeToArray(dateVal), curSplitter, type, valFormat);
    if (isVacuous(dayjsVal)) {
      return null;
    }
    return dayjsVal.map(item => item.format(format)).join(curSplitter);
  }, [date, value, valFormat, timestamp, format, curSplitter]);

  return <Text {...rest}>{curValue}</Text>;
};
