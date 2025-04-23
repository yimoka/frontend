import { IAny } from '@yimoka/shared';

function getGlobalThis(): IAny {
  try {
    if (typeof self !== 'undefined') {
      return self;
    }
  } catch (e) {
    // Ignore error
  }
  try {
    if (typeof globalThisPolyfill !== 'undefined') {
      return globalThisPolyfill;
    }
  } catch (e) {
    // Ignore error
  }
  try {
    if (typeof global !== 'undefined') {
      // eslint-disable-next-line no-undef
      return global;
    }
  } catch (e) {
    // Ignore error
  }
  // eslint-disable-next-line no-new-func
  return Function('return this')();
}
export const globalThisPolyfill: Window = getGlobalThis();
