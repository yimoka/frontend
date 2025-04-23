import { IAny } from '@yimoka/shared';

import { isFn } from './types';

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export type ISubscriber<Payload = IAny> = (payload: Payload) => void | boolean

export interface IExtendedEvent {
  context?: IAny;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Subscribable<ExtendsType extends IExtendedEvent = any> {
  private subscribers: {
    index: number;
    [key: number]: ISubscriber;
  } = {
      index: 0,
    };

  dispatch<T extends ExtendsType = any>(event: T, context?: IAny) {
    let interrupted = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.subscribers) {
      if (isFn(this.subscribers[key])) {
        // eslint-disable-next-line no-param-reassign
        event.context = context;
        if (this.subscribers[key](event) === false) {
          interrupted = true;
        }
      }
    }
    return !interrupted;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  subscribe(subscriber: ISubscriber) {
    let id = 0;
    if (isFn(subscriber)) {
      id = this.subscribers.index + 1;
      this.subscribers[id] = subscriber;
      this.subscribers.index = this.subscribers.index + 1;
    }

    const unsubscribe = () => {
      this.unsubscribe(id);
    };

    // 使用类型断言告诉TypeScript这是安全的
    (unsubscribe as IAny)[UNSUBSCRIBE_ID_SYMBOL] = id;

    return unsubscribe;
  }

  unsubscribe = (id?: number | string | (() => void)) => {
    if (id === undefined || id === null) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in this.subscribers) {
        this.unsubscribe(key);
      }
      return;
    }
    if (!isFn(id)) {
      delete this.subscribers[id as number];
    } else {
      const unsubscribeFunc = id as IAny;
      if (unsubscribeFunc[UNSUBSCRIBE_ID_SYMBOL] !== undefined) {
        delete this.subscribers[unsubscribeFunc[UNSUBSCRIBE_ID_SYMBOL]];
      }
    }
  };
}
