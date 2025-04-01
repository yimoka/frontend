import dayjs from 'dayjs';
import { describe, it, expect } from 'vitest';

import { toDayjs, getDateValue, getPresetsDate, getPresetsDateRange } from '../date';

describe('toDayjs', () => {
  it('should return the same Dayjs object if input is a Dayjs object', () => {
    const dayjsObj = dayjs();
    expect(toDayjs(dayjsObj)).toBe(dayjsObj);
  });

  it('should convert Date object to Dayjs object', () => {
    const dateObj = new Date();
    expect(toDayjs(dateObj).isSame(dayjs(dateObj))).toBe(true);
  });

  it('should convert milliseconds timestamp to Dayjs object', () => {
    const timestamp = Date.now();
    expect(toDayjs(timestamp).isSame(dayjs(timestamp))).toBe(true);
  });

  it('should convert seconds timestamp to Dayjs object', () => {
    const unixTimestamp = Math.floor(Date.now() / 1000);
    expect(toDayjs(unixTimestamp, { type: 's' }).isSame(dayjs.unix(unixTimestamp))).toBe(true);
  });

  it('should convert numeric string to Dayjs object', () => {
    const numericString = '1633072800000';
    expect(toDayjs(numericString).isSame(dayjs(Number(numericString)))).toBe(true);
  });

  it('should convert formatted date string to Dayjs object', () => {
    const dateString = '2021-10-01';
    expect(toDayjs(dateString, { format: 'YYYY-MM-DD' }).isSame(dayjs(dateString, 'YYYY-MM-DD'))).toBe(true);
  });
});

describe('getDateValue', () => {
  const date = dayjs('2023-10-05');

  it('should return milliseconds', () => {
    expect(getDateValue(date, { type: 'ms' })).toBe(date.valueOf());
  });

  it('should return seconds', () => {
    expect(getDateValue(date, { type: 's' })).toBe(date.unix());
  });

  it('should return formatted string', () => {
    expect(getDateValue(date, { type: 'string', format: 'YYYY-MM-DD' })).toBe('2023-10-05');
  });

  it('should return Date object', () => {
    expect(getDateValue(date, { type: 'date' })).toEqual(date.toDate());
  });

  it('should return Dayjs object', () => {
    expect(getDateValue(date, {})).toBe(date);
  });
});

describe('getPresetsDate', () => {
  it('should return today\'s date for "today" preset', () => {
    const today = dayjs().startOf('day');
    expect(getPresetsDate('today').isSame(today)).toBe(true);
  });

  it('should return yesterday\'s date for "yesterday" preset', () => {
    const yesterday = dayjs().subtract(1, 'day');
    expect(getPresetsDate('yesterday').unix()).toBe(yesterday.unix());
  });

  it('should return next week\'s date for "1W" preset', () => {
    const nextWeek = dayjs().add(1, 'week');
    expect(getPresetsDate('1w').isSame(nextWeek)).toBe(true);
  });

  it('should return next month\'s date for "1M" preset', () => {
    const nextMonth = dayjs().add(1, 'month');
    expect(getPresetsDate('1M').isSame(nextMonth)).toBe(true);
  });

  it('should return today\'s date for "1" preset', () => {
    const today = dayjs();
    expect(getPresetsDate('1x').isSame(today)).toBe(true);
  });
  it('should return today\'s date for "1" preset', () => {
    const today = dayjs();
    expect(getPresetsDate('xxxx').isSame(today)).toBe(true);
  });
});

describe('getPresetsDateRange', () => {
  it('should return today\'s date range for "today" preset', () => {
    const todayStart = dayjs().startOf('day');
    const todayEnd = dayjs().endOf('day');
    const [start, end] = getPresetsDateRange('today');
    expect(start.isSame(todayStart)).toBe(true);
    expect(end.isSame(todayEnd)).toBe(true);
  });

  it('should return yesterday\'s date range for "yesterday" preset', () => {
    const yesterdayStart = dayjs().subtract(1, 'day')
      .startOf('day');
    const yesterdayEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('yesterday');
    expect(start.isSame(yesterdayStart)).toBe(true);
    expect(end.isSame(yesterdayEnd)).toBe(true);
  });

  it('should return last3Days\'s date range for "last3Days" preset', () => {
    const last3DaysStart = dayjs().subtract(2, 'day');
    const last3DaysEnd = dayjs();
    const [start, end] = getPresetsDateRange('last3Days');
    expect(start.isSame(last3DaysStart)).toBe(true);
    expect(end.isSame(last3DaysEnd)).toBe(true);
  });

  it('should return past3Days\'s date range for "past3Days" preset', () => {
    const past3DaysStart = dayjs().subtract(3, 'day')
      .startOf('day');
    const past3DaysEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('past3Days');
    expect(start.isSame(past3DaysStart)).toBe(true);
    expect(end.isSame(past3DaysEnd)).toBe(true);
  });

  it('should return this week\'s date range for "week" preset', () => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs().endOf('week');
    const [start, end] = getPresetsDateRange('week');
    expect(start.isSame(weekStart)).toBe(true);
    expect(end.isSame(weekEnd)).toBe(true);
  });

  it('should return this week\'s date range for "weekSoFar" preset', () => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs();
    const [start, end] = getPresetsDateRange('weekSoFar');
    expect(start.isSame(weekStart)).toBe(true);
    expect(end.isSame(weekEnd)).toBe(true);
  });

  it('should return last week\'s date range for "lastWeek" preset', () => {
    const lastWeekStart = dayjs().subtract(1, 'week');
    const lastWeekEnd = dayjs();
    const [start, end] = getPresetsDateRange('lastWeek');
    expect(start.isSame(lastWeekStart)).toBe(true);
    expect(end.isSame(lastWeekEnd)).toBe(true);
  });

  // pastWeek
  it('should return past week\'s date range for "pastWeek" preset', () => {
    const pastWeekStart = dayjs().add(-1, 'week')
      .startOf('day');
    const pastWeekEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('pastWeek');
    expect(start.isSame(pastWeekStart)).toBe(true);
    expect(end.isSame(pastWeekEnd)).toBe(true);
  });

  // prevWeek
  it('should return prev week\'s date range for "prevWeek" preset', () => {
    const prevWeekStart = dayjs().subtract(1, 'week')
      .startOf('week');
    const prevWeekEnd = dayjs().subtract(1, 'week')
      .endOf('week');
    const [start, end] = getPresetsDateRange('prevWeek');
    expect(start.isSame(prevWeekStart)).toBe(true);
    expect(end.isSame(prevWeekEnd)).toBe(true);
  });

  it('should return this month\'s date range for "month" preset', () => {
    const monthStart = dayjs().startOf('month');
    const monthEnd = dayjs().endOf('month');
    const [start, end] = getPresetsDateRange('month');
    expect(start.isSame(monthStart)).toBe(true);
    expect(end.isSame(monthEnd)).toBe(true);
  });

  it('should return today\'s date for "xxxx" preset', () => {
    const today = dayjs();
    const [start, end] = getPresetsDateRange('xxxx');
    expect(start.isSame(today)).toBe(true);
    expect(end.isSame(today)).toBe(true);
  });
});
