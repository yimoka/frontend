import { IAny } from '@yimoka/shared';

export const compose = (...fns: ((payload: IAny) => IAny)[]) => (payload: IAny) => fns.reduce((buf, fn) => fn(buf), payload);
