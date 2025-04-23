import { globalThisPolyfill } from '@yimoka/designable-shared';

import * as Core from './exports';
export * from './exports';

// 为globalThisPolyfill扩展类型声明
declare global {
  interface Window {
    Designable?: {
      Core?: typeof Core;
    };
  }
}

// 扩展globalThisPolyfill类型
interface IGlobalThisWithDesignable extends Window {
  Designable?: {
    Core?: typeof Core;
  };
}

const global = globalThisPolyfill as IGlobalThisWithDesignable;

// 简化全局对象处理
if (!global.Designable) {
  global.Designable = {};
}

if (!global.Designable.Core) {
  global.Designable.Core = Core;
}
