// 为了在低代码中方便日期/时间的处理，我们提供了一些日期/时间的工具函数。
import dayjs, { Dayjs, ManipulateType } from 'dayjs';

/**
 * 将各种类型的日期转换为 Dayjs 对象。
 *
 * @param date - 要转换的日期，可以是 Dayjs 对象、Date 对象、数字（时间戳）、字符串等。
 * @param options - 可选参数，用于指定日期类型和格式。
 * @param options.type - 日期类型，'s' 表示秒，默认为毫秒。
 * @param options.format - 日期格式，用于解析字符串日期。
 * @returns 转换后的 Dayjs 对象。
 *
 * @example
 * ```typescript
 * // 将 Dayjs 对象直接返回
 * const dayjsObj = dayjs();
 * console.log(toDayjs(dayjsObj)); // 输出: dayjsObj
 *
 * // 将 Date 对象转换为 Dayjs 对象
 * const dateObj = new Date();
 * console.log(toDayjs(dateObj)); // 输出: Dayjs 对象，表示当前日期
 *
 * // 将毫秒时间戳转换为 Dayjs 对象
 * const timestamp = Date.now();
 * console.log(toDayjs(timestamp)); // 输出: Dayjs 对象，表示当前日期
 *
 * // 将秒时间戳转换为 Dayjs 对象
 * const unixTimestamp = Math.floor(Date.now() / 1000);
 * console.log(toDayjs(unixTimestamp, { type: 's' })); // 输出: Dayjs 对象，表示当前日期
 *
 * // 将纯数字字符串转换为 Dayjs 对象
 * const numericString = '1633072800000';
 * console.log(toDayjs(numericString)); // 输出: Dayjs 对象，表示对应的日期
 *
 * // 将格式化的日期字符串转换为 Dayjs 对象
 * const dateString = '2021-10-01';
 * console.log(toDayjs(dateString, { format: 'YYYY-MM-DD' })); // 输出: Dayjs 对象，表示 2021-10-01
 * ```
 */
export const toDayjs = (date: IDate, options?: IDateOptions): Dayjs => {
  if (dayjs.isDayjs(date)) {
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

/**
 * 根据指定的选项获取日期值。
 *
 * @param data - Dayjs 对象，表示日期。
 * @param options - 日期选项对象。
 * @param options.type - 返回值的类型，可以是 'ms'（毫秒数）、's'（秒数）、'string'（格式化字符串）或 'date'（Date 对象）。
 * @param options.format - 当 type 为 'string' 时，指定的格式化字符串。
 * @returns 根据选项返回相应类型的日期值。
 *
 * @example
 * ```typescript
 * const dayjs = require('dayjs');
 * const date = dayjs('2023-10-05');
 *
 * // 返回毫秒数
 * getDateValue(date, { type: 'ms' });
 * // 输出: 1696464000000
 *
 * // 返回秒数
 * getDateValue(date, { type: 's' });
 * // 输出: 1696464000
 *
 * // 返回格式化字符串
 * getDateValue(date, { type: 'string', format: 'YYYY-MM-DD' });
 * // 输出: '2023-10-05'
 *
 * // 返回 Date 对象
 * getDateValue(date, { type: 'date' });
 * // 输出: Thu Oct 05 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 *
 * // 返回 Dayjs 对象
 * getDateValue(date, {});
 * // 输出: Dayjs 对象
 * ```
 */
export const getDateValue = (data: Dayjs, options: IDateOptions) => {
  const { type, format } = options;
  if (type === 'ms') {
    return data.valueOf();
  }
  if (type === 's') {
    return data.unix();
  }
  if (type === 'string') {
    return data.format(format);
  }
  if (type === 'date') {
    return data.toDate();
  }
  return data;
};

/**
 * 获取预设日期。
 *
 * @param presets - 预设日期，可以是字符串或字符串数组。
 * @param d - 可选参数，指定的日期，默认为当前日期。
 * @returns 计算后的日期。
 *
 * @example
 * // 示例1：传入字符串预设
 * const result1 = getPresetsDate('today');
 * console.log(result1); // 输出当前日期
 *
 * @example
 * // 示例2：传入字符串数组预设
 * const result2 = getPresetsDate(['today', '1w']);
 * console.log(result2); // 输出下周的今天
 *
 * @example
 * // 示例3：传入字符串预设和指定日期
 * const result3 = getPresetsDate('1M', dayjs('2023-01-01'));
 * console.log(result3); // 输出2023年2月1日
 *
 * @example
 * // 示例4：传入字符串数组预设和指定日期
 * const result4 = getPresetsDate(['1M', '1w'], dayjs('2023-01-01'));
 * console.log(result4); // 输出2023年2月8日
 */
export const getPresetsDate = (presets: IPresetsDate, d?: Dayjs) => {
  const day = d ?? dayjs();
  let result = day;
  if (typeof presets === 'string') {
    return getPresetDate(presets, result);
  }
  presets.forEach((r) => {
    result = getPresetDate(r, result);
  });
  return result;
};


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


/**
 * 获取预设日期范围。
 *
 * @param presets - 预设日期范围，可以是字符串或日期范围数组。
 * @param ds - 可选的默认日期范围数组。
 * @returns 返回计算后的日期范围数组。
 *
 * @example
 * ```typescript
 * // 获取今天的日期范围
 * const todayRange = getPresetsDateRange('today');
 * console.log(todayRange); // [Dayjs, Dayjs] 表示今天的开始和结束日期
 *
 * // 获取昨天的日期范围
 * const yesterdayRange = getPresetsDateRange('yesterday');
 * console.log(yesterdayRange); // [Dayjs, Dayjs] 表示昨天的开始和结束日期
 *
 * ```
 */
export const getPresetsDateRange = (presets: IPresetsDateRange, ds?: [Dayjs, Dayjs]): [Dayjs, Dayjs] => {
  if (typeof presets === 'string') {
    const ruleMap: Record<string, [string | string[], string | string[]]> = {
      today: ['start-D', 'end-D'],
      todaySoFar: ['start-D', 'cur'],
      yesterday: [['-1d', 'start-D'], ['-1d', 'end-D']],
      last3Days: ['-2d', 'cur'],
      past3Days: [['-3d', 'start-D'], ['-1d', 'end-D']],
      last7Days: ['-6d', 'cur'],
      past7Days: [['-7d', 'start-D'], ['-1d', 'end-D']],
      last15Days: ['-14d', 'cur'],
      past15Days: [['-15d', 'start-D'], ['-1d', 'end-D']],
      week: ['start-w', 'end-w'],
      weekSoFar: ['start-w', 'cur'],
      lastWeek: ['-1w', 'cur'],
      pastWeek: [['-1w', 'start-D'], ['-1d', 'end-D']],
      prevWeek: [['-1w', 'start-w'], ['-1w', 'end-w']],
      month: ['start-M', 'end-M'],
      monthSoFar: ['start-M', 'cur'],
      lastMonth: ['-1M', 'cur'],
      pastMonth: [['-1M', 'start-D'], ['-1d', 'end-D']],
      prevMonth: [['-1M', 'start-M'], ['-1M', 'end-M']],
      quarter: ['start-Q', 'end-Q'],
      quarterSoFar: ['start-Q', 'cur'],
      lastQuarter: ['-1Q', 'cur'],
      pastQuarter: [['-1Q', 'start-D'], ['-1d', 'end-D']],
      prevQuarter: [['-1Q', 'start-Q'], ['-1Q', 'end-Q']],
      year: ['start-y', 'end-y'],
      yearSoFar: ['start-y', 'cur'],
      lastYear: ['-1y', 'cur'],
      pastYear: [['-1y', 'start-D'], ['-1d', 'end-D']],
      prevYear: [['-1y', 'start-y'], ['-1y', 'end-y']],
    };
    if (ruleMap[presets]) {
      return getPresetsDateRange(ruleMap[presets], ds);
    }
    return ds ?? [dayjs(), dayjs()];
  }
  const [start, end] = presets;
  return [getPresetsDate(start, ds?.[0]), getPresetsDate(end, ds?.[1])];
};

const units = ['date', 'D', 'day', 'd', 'week', 'w', 'month', 'M', 'quarter', 'Q', 'year', 'y', 'hour', 'h', 'minute', 'm', 'second', 's', 'millisecond', 'ms'];

// 日期常用的格式为 毫秒数 秒数 字符串格式 dayjs 对象 和 Date 对象
export type IDateType = 'ms' | 's' | 'string' | 'dayjs' | 'date';

export type IDate = number | string | Dayjs | Date;

export interface IDateOptions {
  type?: IDateType;
  format?: string;
}

export type IPresetsDate = string | string[]

export type IPresetsDateRange = string | [IPresetsDate, IPresetsDate]
