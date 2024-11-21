
/**
 * 安全地解析 JSON 字符串，如果解析失败则返回默认值。
 *
 * @param text - 要解析的 JSON 字符串。
 * @param defaultValue - 解析失败时返回的默认值，默认为空对象。
 * @param reviver - 可选的函数，用于转换结果。该函数会为对象的每个成员调用。
 * @returns 解析后的对象，如果解析失败则返回默认值。
 */
export const JSONParse = (text: string, defaultValue: object = {}, reviver?: Parameters<typeof JSON.parse>[1]) => {
  try {
    return JSON.parse(text, reviver);
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
};

type StringifyParams = Parameters<typeof JSON.stringify>;

/**
 * 将给定的值转换为 JSON 字符串。
 *
 * @param value - 要转换的值。
 * @param defaultValue - 如果转换失败，返回的默认值，默认为空字符串。
 * @param replacer - 可选的替换函数或数组，用于选择或修改要包含在 JSON 字符串中的属性。
 * @param space - 可选的用于增加返回值 JSON 字符串的可读性的空白字符。
 * @returns 转换后的 JSON 字符串，如果转换失败则返回默认值。
 */
export const JSONStringify = (value: unknown, defaultValue = '', replacer?: StringifyParams[1], space?: StringifyParams[2]) => {
  if (!value || typeof value !== 'object') {
    return defaultValue;
  }
  try {
    return JSON.stringify(value, replacer, space);
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
};
