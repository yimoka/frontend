import { IAny, IAnyObject } from '@yimoka/shared';

type INotifierType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'warn' | 'open' | 'close' | 'destroy' | 'confirm' | string;

// 定义通知器
export type INotifier = (type: INotifierType, msg: IAny, options?: IAnyObject) => void;
