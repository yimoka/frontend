export const compose = (...fns: ((payload: any) => any)[]) => (payload: any) => fns.reduce((buf, fn) => fn(buf), payload);
