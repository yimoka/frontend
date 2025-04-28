// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IAny = any;

export type IKey = string | number | bigint;

export type IObjKey = string | number | symbol

export type IAnyObject = Record<IObjKey, IAny>

export type IStrKeyObject = Record<string, IAny>

