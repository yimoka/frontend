/**
 * 在指定限制内将步长值添加到给定数字。
 *
 * @param num - 要增加的初始数字。
 * @param options - 包含以下属性的对象：
 * @param options.step - 要添加到初始数字的值。默认值为1。
 * @param options.max - 数字的最大限制。默认值为1000。
 * @param options.min - 数字的最小限制。默认值为0。
 * @param options.initial - 如果数字超出限制，则返回的初始值。默认值为0。
 * @returns 增加后的数字或如果超出限制则返回初始值。
 */
export const addWithLimit = (num: number, { step = 1, max = 1000, min = 0, initial = 0 } = {}) => {
  if (num >= max) {
    return initial;
  }
  return Math.max(Math.min(num + step, max), min);
};

/**
 * 将数字或字符串转换为数字。
 *
 * @param v - 要转换的值。
 * @param option - 包含以下属性的对象：
 * @param option.defaults - 如果无法转换为数字，则返回的默认值。默认值为0。
 * @param option.pattern - 用于匹配非数字字符的正则表达式模式。默认值为 '[^0-9.]'。
 * @param option.flags - 用于匹配非数字字符的正则表达式标志。默认值为 'g'。
 * @returns 转换后的数字。
 */
export const toNumber = (v: number | string, option?: IToNumberOption) => {
  if (typeof v === 'number') {
    return v;
  }
  const { defaults = 0, pattern = '[^0-9.]', flags = 'g' } = option ?? {};
  if (typeof v === 'string') {
    const reg = new RegExp(pattern, flags);
    const numStr = v.replace(reg, '');
    return Number(numStr);
  }
  return defaults;
};


export interface IToNumberOption {
  defaults?: number,
  pattern?: string,
  flags?: string
}
