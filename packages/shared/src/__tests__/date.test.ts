import dayjs from 'dayjs';
import { describe, it, expect } from 'vitest';

import { toDayjs, getDateValue, getPresetsDate, getPresetsDateRange } from '../date';

describe('toDayjs', () => {
  it('如果输入是 undefined，应该返回 undefined', () => {
    expect(toDayjs(undefined)).toBe(undefined);
  });
  it('如果输入是 Dayjs 对象，应该返回相同的 Dayjs 对象', () => {
    const dayjsObj = dayjs();
    expect(toDayjs(dayjsObj)).toBe(dayjsObj);
  });

  it('应该将 Date 对象转换为 Dayjs 对象', () => {
    const dateObj = new Date();
    expect(toDayjs(dateObj).isSame(dayjs(dateObj))).toBe(true);
  });

  it('应该将毫秒时间戳转换为 Dayjs 对象', () => {
    const timestamp = Date.now();
    expect(toDayjs(timestamp).isSame(dayjs(timestamp))).toBe(true);
  });

  it('应该将秒时间戳转换为 Dayjs 对象', () => {
    const unixTimestamp = Math.floor(Date.now() / 1000);
    expect(toDayjs(unixTimestamp, { type: 's' }).isSame(dayjs.unix(unixTimestamp))).toBe(true);
  });

  it('应该将数字字符串转换为 Dayjs 对象', () => {
    const numericString = '1633072800000';
    expect(toDayjs(numericString).isSame(dayjs(Number(numericString)))).toBe(true);
  });

  it('应该将格式化的日期字符串转换为 Dayjs 对象', () => {
    const dateString = '2021-10-01';
    expect(toDayjs(dateString, { format: 'YYYY-MM-DD' }).isSame(dayjs(dateString, 'YYYY-MM-DD'))).toBe(true);
  });
});

describe('getDateValue', () => {
  const date = dayjs('2023-10-05');

  it('应该返回毫秒时间戳', () => {
    expect(getDateValue(date, { type: 'ms' })).toBe(date.valueOf());
  });

  it('应该返回秒时间戳', () => {
    expect(getDateValue(date, { type: 's' })).toBe(date.unix());
  });

  it('应该返回格式化的字符串', () => {
    expect(getDateValue(date, { type: 'string', format: 'YYYY-MM-DD' })).toBe('2023-10-05');
  });

  it('应该返回 Date 对象', () => {
    expect(getDateValue(date, { type: 'date' })).toEqual(date.toDate());
  });

  it('应该返回 Dayjs 对象', () => {
    expect(getDateValue(date, {})).toBe(date);
  });
});

describe('getPresetsDate', () => {
  it('对于 "today" 预设应该返回今天的日期', () => {
    const today = dayjs().startOf('day');
    expect(getPresetsDate('today').unix()).toBe(today.unix());
  });

  it('对于 "yesterday" 预设应该返回昨天的日期', () => {
    const yesterday = dayjs().subtract(1, 'day');
    expect(getPresetsDate('yesterday').unix()).toBe(yesterday.unix());
  });

  it('对于 "1W" 预设应该返回下周的日期', () => {
    const nextWeek = dayjs().add(1, 'week');
    expect(getPresetsDate('1w').unix()).toBe(nextWeek.unix());
  });

  it('对于 "1M" 预设应该返回下个月的日期', () => {
    const nextMonth = dayjs().add(1, 'month');
    expect(getPresetsDate('1M').unix()).toBe(nextMonth.unix());
  });

  it('对于 "1" 预设应该返回今天的日期', () => {
    const today = dayjs();
    expect(getPresetsDate('1x').unix()).toBe(today.unix());
  });

  it('对于无效预设应该返回今天的日期', () => {
    const today = dayjs();
    expect(getPresetsDate('xxxx').unix()).toBe(today.unix());
  });

  it('对于无效单位应该返回当前日期', () => {
    const today = dayjs();
    // 测试无效的数字+单位格式
    expect(getPresetsDate('1xyz').unix()).toBe(today.unix());
    expect(getPresetsDate('-1xyz').unix()).toBe(today.unix());
    expect(getPresetsDate('1').unix()).toBe(today.unix()); // 测试只有数字没有单位的情况
    expect(getPresetsDate('1 ').unix()).toBe(today.unix()); // 测试数字后面跟空格
    expect(getPresetsDate('1!').unix()).toBe(today.unix()); // 测试特殊字符作为单位
    expect(getPresetsDate('1@').unix()).toBe(today.unix()); // 测试特殊字符作为单位
    expect(getPresetsDate('1#').unix()).toBe(today.unix()); // 测试特殊字符作为单位
    expect(getPresetsDate('-1 ').unix()).toBe(today.unix()); // 测试负数后面跟空格
    expect(getPresetsDate('1abc').unix()).toBe(today.unix()); // 测试完全匹配正则但单位不在 units 数组中
    expect(getPresetsDate('-1abc').unix()).toBe(today.unix()); // 测试完全匹配正则但单位不在 units 数组中（负数）
    expect(getPresetsDate('123abc').unix()).toBe(today.unix()); // 测试多位数字
    expect(getPresetsDate('-123abc').unix()).toBe(today.unix()); // 测试多位负数
    expect(getPresetsDate('0abc').unix()).toBe(today.unix()); // 测试零
    expect(getPresetsDate('-0abc').unix()).toBe(today.unix()); // 测试负零
    // 测试无效的 start/end 格式
    expect(getPresetsDate('start-xyz').unix()).toBe(today.unix());
    expect(getPresetsDate('end-xyz').unix()).toBe(today.unix());
    // 测试其他无效格式
    expect(getPresetsDate('invalid').unix()).toBe(today.unix());
  });

  it('对于无效的 start/end 单位应该返回当前日期', () => {
    const today = dayjs();
    expect(getPresetsDate('start-invalid').unix()).toBe(today.unix());
    expect(getPresetsDate('end-invalid').unix()).toBe(today.unix());
    expect(getPresetsDate('start-').unix()).toBe(today.unix());
    expect(getPresetsDate('end-').unix()).toBe(today.unix());
  });

  it('对于数组预设应该正确处理无效单位', () => {
    const today = dayjs();
    expect(getPresetsDate(['1xyz', 'start-xyz']).unix()).toBe(today.unix());
  });
});

describe('getPresetsDateRange', () => {
  it('对于 "today" 预设应该返回今天的日期范围', () => {
    const todayStart = dayjs().startOf('day');
    const todayEnd = dayjs().endOf('day');
    const [start, end] = getPresetsDateRange('today');
    expect(start.unix()).toBe(todayStart.unix());
    expect(end.unix()).toBe(todayEnd.unix());
  });

  it('对于 "yesterday" 预设应该返回昨天的日期范围', () => {
    const yesterdayStart = dayjs().subtract(1, 'day')
      .startOf('day');
    const yesterdayEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('yesterday');
    expect(start.unix()).toBe(yesterdayStart.unix());
    expect(end.unix()).toBe(yesterdayEnd.unix());
  });

  it('对于 "last3Days" 预设应该返回最近3天的日期范围', () => {
    const today = dayjs();
    const [start, end] = getPresetsDateRange('last3Days');
    const expectedStart = today.subtract(2, 'day');
    const expectedEnd = today;
    expect(start.unix()).toBe(expectedStart.unix());
    expect(end.unix()).toBe(expectedEnd.unix());
  });

  it('对于 "past3Days" 预设应该返回过去3天的日期范围', () => {
    const past3DaysStart = dayjs().subtract(3, 'day')
      .startOf('day');
    const past3DaysEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('past3Days');
    expect(start.unix()).toBe(past3DaysStart.unix());
    expect(end.unix()).toBe(past3DaysEnd.unix());
  });

  it('对于 "week" 预设应该返回本周的日期范围', () => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs().endOf('week');
    const [start, end] = getPresetsDateRange('week');
    expect(start.unix()).toBe(weekStart.unix());
    expect(end.unix()).toBe(weekEnd.unix());
  });

  it('对于 "weekSoFar" 预设应该返回本周至今的日期范围', () => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs();
    const [start, end] = getPresetsDateRange('weekSoFar');
    expect(start.unix()).toBe(weekStart.unix());
    expect(end.unix()).toBe(weekEnd.unix());
  });

  it('对于 "lastWeek" 预设应该返回上周的日期范围', () => {
    const lastWeekStart = dayjs().subtract(1, 'week');
    const lastWeekEnd = dayjs();
    const [start, end] = getPresetsDateRange('lastWeek');
    expect(start.unix()).toBe(lastWeekStart.unix());
    expect(end.unix()).toBe(lastWeekEnd.unix());
  });

  it('对于 "pastWeek" 预设应该返回过去一周的日期范围', () => {
    const pastWeekStart = dayjs().add(-1, 'week')
      .startOf('day');
    const pastWeekEnd = dayjs().subtract(1, 'day')
      .endOf('day');
    const [start, end] = getPresetsDateRange('pastWeek');
    expect(start.unix()).toBe(pastWeekStart.unix());
    expect(end.unix()).toBe(pastWeekEnd.unix());
  });

  it('对于 "prevWeek" 预设应该返回上一周的日期范围', () => {
    const prevWeekStart = dayjs().subtract(1, 'week')
      .startOf('week');
    const prevWeekEnd = dayjs().subtract(1, 'week')
      .endOf('week');
    const [start, end] = getPresetsDateRange('prevWeek');
    expect(start.unix()).toBe(prevWeekStart.unix());
    expect(end.unix()).toBe(prevWeekEnd.unix());
  });

  it('对于 "month" 预设应该返回本月的日期范围', () => {
    const monthStart = dayjs().startOf('month');
    const monthEnd = dayjs().endOf('month');
    const [start, end] = getPresetsDateRange('month');
    expect(start.unix()).toBe(monthStart.unix());
    expect(end.unix()).toBe(monthEnd.unix());
  });

  it('对于无效预设应该返回今天的日期范围', () => {
    const today = dayjs();
    const [start, end] = getPresetsDateRange('xxxx');
    expect(start.unix()).toBe(today.unix());
    expect(end.unix()).toBe(today.unix());
  });

  // 新增测试用例：测试未覆盖的分支
  it('对于无效的预设应该返回默认日期范围', () => {
    const today = dayjs();
    // 测试不在 ruleMap 中的预设
    const [start1, end1] = getPresetsDateRange('invalid_preset');
    expect(start1.unix()).toBe(today.unix());
    expect(end1.unix()).toBe(today.unix());

    // 测试带有默认值的情况
    const defaultStart = dayjs().subtract(1, 'day');
    const defaultEnd = dayjs().add(1, 'day');
    const [start2, end2] = getPresetsDateRange('invalid_preset', [defaultStart, defaultEnd]);
    expect(start2.unix()).toBe(defaultStart.unix());
    expect(end2.unix()).toBe(defaultEnd.unix());
  });

  it('对于数组格式的预设应该正确处理', () => {
    const today = dayjs();
    // 测试正常的数组格式
    const [start1, end1] = getPresetsDateRange(['1d', '2d']);
    const expectedStart1 = today.add(1, 'day');
    const expectedEnd1 = today.add(2, 'day');
    expect(start1.unix()).toBe(expectedStart1.unix());
    expect(end1.unix()).toBe(expectedEnd1.unix());

    // 测试带有默认值的数组格式
    const defaultStart = dayjs().subtract(1, 'day');
    const defaultEnd = dayjs().add(1, 'day');
    const [start2, end2] = getPresetsDateRange(['1d', '2d'], [defaultStart, defaultEnd]);
    const expectedStart2 = defaultStart.add(1, 'day');
    const expectedEnd2 = defaultEnd.add(2, 'day');
    expect(start2.unix()).toBe(expectedStart2.unix());
    expect(end2.unix()).toBe(expectedEnd2.unix());
  });
});
