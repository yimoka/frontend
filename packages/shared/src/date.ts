// 为了在低代码中方便日期/时间的处理，我们提供了一些日期/时间的工具函数。
import dayjs, { Dayjs, ManipulateType } from 'dayjs';

// 日期常用的格式为 毫秒数 秒数 字符串格式 dayjs 对象 和 Date 对象

export type IDateType = 'ms' | 's' | 'string' | 'dayjs' | 'date';

export type IDate = number | string | Dayjs | Date;

// 函数分为获取，转化，格式化，比较，计算，判断等几类。

// 基础思路为各个类似转化为 dayjs 对象，然后利用 dayjs 对象的方法进行处理。

// 获取数据时 通过 dayjs 和字符串转告低码的支持

export interface IDateOptions {
  type?: IDateType;
  format?: string;
}

export const toDayjs = (date: IDate, options?: IDateOptions): Dayjs => {
  if (date instanceof Dayjs) {
    return date;
  }
  if (date instanceof Date) {
    return dayjs(date);
  }
  const { type, format } = options || {};
  if (typeof date === 'number') {
    if (type === 's') {
      return dayjs.unix(date);
    }
    // 默认为毫秒
    return dayjs(date);
  }
  if (typeof date === 'string') {
    const str = date.trim();
    // 为纯数字的字符串
    if (/^\d+$/.test(str)) {
      return toDayjs(Number(str), options);
    }
  }
  return dayjs(date, format);
};


// 获取预设日期
export const getPresetsDate = (rule: string | string[], d?: Dayjs) => {
  const day = d ?? dayjs();
  let result = day;
  if (typeof rule === 'string') {
    return getPresetDate(rule, result);
  }
  rule.forEach((r) => {
    result = getPresetDate(r, result);
  });
  return result;
};

// 根据字符串返回 dayjs 对象 如 today yesterday tomorrow
// 传入 preset 字符串，返回对应的日期
// 传入 dayjs 对象 表示以该日期为基准 如为存在则为当前日期
const getPresetDate = (preset: string, d?: Dayjs): Dayjs => {
  const ruleMap: Record<string, string> = {
    cur: '',
    today: 'start-D',
    yesterday: '-1d',
    week: 'start-w',
    month: 'start-M',
    quarter: 'start-Q',
    year: 'start-y',
    hour: 'start-h',
    minute: 'start-m',
    second: 'start-s',
  };
  const curRule = (ruleMap[preset] ?? preset)?.trim();
  const day = d ?? dayjs();
  if (!curRule) {
    return day;
  }
  const match = curRule.match(/^(-?\d+)(\w+)$/);
  if (match) {
    // 匹配到 数字+单位 例如 -1d 1d
    const [, num, unit] = match;
    if (units.includes(unit)) {
      return day.add(Number(num), unit as ManipulateType);
    }
    // 未匹配到单位 默认返回当前日期
    return day;
  }
  const match2 = curRule.match(/^(start|end)-(\w+)$/);
  if (match2) {
    // 匹配到 start-xx end-xx
    const [, type, unit] = match2;
    if (units.includes(unit)) {
      if (type === 'start') {
        return day.startOf(unit as ManipulateType);
      }
      return day.endOf(unit as ManipulateType);
    }
  }
  return day;
};

const units = ['date', 'D', 'day', 'd', 'week', 'w', 'month', 'M', 'quarter', 'Q', 'year', 'y', 'hour', 'h', 'minute', 'm', 'second', 's', 'millisecond', 'ms'];
