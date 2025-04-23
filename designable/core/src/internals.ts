import { each, isPlainObj, globalThisPolyfill } from '@yimoka/designable-shared';
import { IAny } from '@yimoka/shared';

export const lowerSnake = (str: string) => String(str).replace(/\s+/g, '_')
  .toLocaleLowerCase();

export const mergeLocales = (target: IAny, source: IAny) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, (value, key) => {
      const token = lowerSnake(key);
      const messages = mergeLocales(target[key] || target[token], value);
      target[token] = messages;
    });
    return target;
  } if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {};
    each(source, (value, key) => {
      const messages = mergeLocales(undefined, value);
      result[lowerSnake(key)] = messages;
    });
    return result;
  }
  return source;
};

export const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!globalThisPolyfill.navigator) {
    return 'en';
  }
  return (
    globalThisPolyfill.navigator.browserlanguage
    || globalThisPolyfill.navigator?.language
    || 'en'
  );
};
