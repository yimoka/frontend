/**
 * @file notifier.ts
 * @description 通知器模块，提供消息通知的类型定义
 * @author ickeep <i@ickeep.com>
 * @version 3ab441b - 2025-03-29
 * @module @yimoka/store
 */

import { IAny, IAnyObject } from '@yimoka/shared';

/**
 * 通知类型
 * @description 支持多种通知类型，包括成功、错误、信息、警告等
 * @example
 * ```ts
 * // 成功通知
 * notifier('success', '操作成功');
 *
 * // 错误通知
 * notifier('error', '操作失败');
 *
 * // 确认对话框
 * notifier('confirm', '确定要删除吗？');
 * ```
 */
type INotifierType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'warn' | 'open' | 'close' | 'destroy' | 'confirm' | string;

/**
 * 通知器类型
 * @param type - 通知类型
 * @param msg - 通知消息
 * @param options - 通知选项
 * @description 定义通知器的函数签名，用于显示各种类型的通知消息
 * @example
 * ```ts
 * const notifier: INotifier = (type, msg, options) => {
 *   switch (type) {
 *     case 'success':
 *       message.success(msg);
 *       break;
 *     case 'error':
 *       message.error(msg);
 *       break;
 *     default:
 *       message.info(msg);
 *   }
 * };
 * ```
 */
export type INotifier = (type: INotifierType, msg: IAny, options?: IAnyObject) => void;
