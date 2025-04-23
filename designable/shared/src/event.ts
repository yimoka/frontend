import { IAny } from '@yimoka/shared';

import { globalThisPolyfill } from './globalThisPolyfill';
import { Subscribable, ISubscriber } from './subscribable';
import { isArr, isWindow } from './types';

const ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL');
const EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__');
const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL');
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL');
const DRIVER_INSTANCES_SYMBOL = Symbol('DRIVER_INSTANCES_SYMBOL');

// 为Symbol索引类型声明接口
interface SymbolKeyed {
  [ATTACHED_SYMBOL]?: IEventDriver[];
  [EVENTS_SYMBOL]?: Record<string, Map<IAny, boolean>>;
  [EVENTS_ONCE_SYMBOL]?: Record<string, IAny>;
  [EVENTS_BATCH_SYMBOL]?: Record<string, IAny>;
  [DRIVER_INSTANCES_SYMBOL]?: IEventDriver[];
}

// 额外的接口，用于表示含有contains方法的对象
interface ContainerWithContains {
  contains(other: Node | null): boolean;
}

export type EventOptions =
  | boolean
  | (AddEventListenerOptions &
    EventListenerOptions & {
      mode?: 'onlyOne' | 'onlyParent' | 'onlyChild'
    })

export type EventContainer = Window | HTMLElement | HTMLDocument

export type EventDriverContainer = HTMLElement | HTMLDocument

export type IEventEffect<T> = (engine: T) => void

export interface IEventDriver {
  container: EventDriverContainer
  contentWindow: Window
  attach(container: EventDriverContainer): void
  detach(container: EventDriverContainer): void
  dispatch<T extends ICustomEvent<IAny> = IAny>(event: T): void | boolean
  subscribe<T extends ICustomEvent<IAny> = IAny>(subscriber: ISubscriber<T>): void
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  addEventListener(type: IAny, listener: IAny, options: IAny): void
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  removeEventListener(type: IAny, listener: IAny, options?: IAny): void
  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(type: IAny, listener: IAny, options?: IAny): void
  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(type: IAny, listener: IAny, options: IAny): void
}

export type IEventDriverClass<T> = new (engine: T, context?: IAny) => IEventDriver

export interface ICustomEvent<EventData = IAny, EventContext = IAny> {
  type: string
  data?: EventData
  context?: EventContext
}

export type CustomEventClass = new (...args: IAny[]) => IAny

export interface IEventProps<T = Event> {
  drivers?: IEventDriverClass<T>[]
  effects?: IEventEffect<T>[]
}

const isOnlyMode = (mode: string) => mode === 'onlyOne' || mode === 'onlyChild' || mode === 'onlyParent';
/**
 * 事件驱动器基类
 */
export class EventDriver<Engine extends Event = Event, Context = IAny>
  implements IEventDriver {
  engine: Engine;

  container: EventDriverContainer = document;

  contentWindow: Window = globalThisPolyfill;

  context!: Context;

  constructor(engine: Engine, context?: Context) {
    this.engine = engine;

    // 在TypeScript中，我们需要使用!操作符来告诉编译器这个赋值是安全的
    this.context = context!;
  }

  dispatch<T extends ICustomEvent<IAny> = IAny>(event: T) {
    return this.engine.dispatch(event, this.context);
  }

  subscribe<T extends ICustomEvent<IAny> = IAny>(subscriber: ISubscriber<T>) {
    return this.engine.subscribe(subscriber);
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: ISubscriber<InstanceType<T>>,
  ) {
    return this.engine.subscribeTo(type, subscriber);
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>,
  ) {
    return this.engine.subscribeWith(type, subscriber);
  }

  attach(_container: EventDriverContainer) {
    console.error('attach must implement.');
  }

  detach(_container: EventDriverContainer) {
    console.error('attach must implement.');
  }

  eventTarget(type: string) {
    if (type === 'resize' || type === 'scroll') {
      if (this.container === this.contentWindow?.document) {
        return this.contentWindow;
      }
    }
    return this.container;
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  addEventListener(type: IAny, listener: IAny, options: IAny) {
    const target = this.eventTarget(type) as EventTarget & SymbolKeyed;
    if (isOnlyMode(options?.mode)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_ONCE_SYMBOL] = (target as any)[EVENTS_ONCE_SYMBOL] || {};
      const { constructor } = this;

      ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] = ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler = (target as any)[EVENTS_ONCE_SYMBOL][type];

      const container = ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL]?.[type] as EventTarget & SymbolKeyed;
      if (!handler) {
        if (container) {
          if (options.mode === 'onlyChild') {
            // 使用类型断言确保container具有contains方法
            if ((container as unknown as ContainerWithContains).contains
              && (container as unknown as ContainerWithContains).contains(target as unknown as Node)) {
              container.removeEventListener(
                type,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (container as any)[EVENTS_ONCE_SYMBOL][type],
                options,
              );
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              delete (container as any)[EVENTS_ONCE_SYMBOL][type];
            }
          } else if (options.mode === 'onlyParent') {
            // 使用类型断言确保container具有contains方法
            if ((container as unknown as ContainerWithContains).contains
              && (container as unknown as ContainerWithContains).contains(target as unknown as Node)) return;
          }
        }
        target.addEventListener(type, listener, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[EVENTS_ONCE_SYMBOL][type] = listener;

        ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] = ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] || {};

        ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL]![type] = target;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_SYMBOL] = (target as any)[EVENTS_SYMBOL] || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_SYMBOL][type] = (target as any)[EVENTS_SYMBOL][type] || new Map();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(target as any)[EVENTS_SYMBOL][type]?.get?.(listener)) {
        target.addEventListener(type, listener, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[EVENTS_SYMBOL][type]?.set?.(listener, true);
      }
    }
  }

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  removeEventListener(type: IAny, listener: IAny, options?: IAny) {
    const target = this.eventTarget(type) as EventTarget & SymbolKeyed;
    if (isOnlyMode(options?.mode)) {
      const { constructor } = this;

      ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] = ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL] || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_ONCE_SYMBOL] = (target as any)[EVENTS_ONCE_SYMBOL] || {};

      delete ((constructor as unknown) as SymbolKeyed)[EVENTS_ONCE_SYMBOL]![type];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (target as any)[EVENTS_ONCE_SYMBOL][type];
      target.removeEventListener(type, listener, options);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_SYMBOL] = (target as any)[EVENTS_SYMBOL] || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_SYMBOL][type] = (target as any)[EVENTS_SYMBOL][type] || new Map();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any)[EVENTS_SYMBOL][type]?.delete?.(listener);
      target.removeEventListener(type, listener, options);
    }
  }

  batchAddEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchAddEventListener(type: IAny, listener: IAny, options?: IAny) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.engine as any)[DRIVER_INSTANCES_SYMBOL] = (this.engine as any)[DRIVER_INSTANCES_SYMBOL] || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(this.engine as any)[DRIVER_INSTANCES_SYMBOL].includes(this)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.engine as any)[DRIVER_INSTANCES_SYMBOL].push(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.engine as any)[DRIVER_INSTANCES_SYMBOL].forEach((driver: IAny) => {
      // 确保driver上有eventTarget方法
      if (typeof driver.eventTarget === 'function') {
        const target = driver.eventTarget(type) as EventTarget & SymbolKeyed;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[EVENTS_BATCH_SYMBOL] = (target as any)[EVENTS_BATCH_SYMBOL] || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(target as any)[EVENTS_BATCH_SYMBOL][type]) {
          target.addEventListener(type, listener, options);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (target as any)[EVENTS_BATCH_SYMBOL][type] = listener;
        }
      }
    });
  }

  batchRemoveEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => IAny,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventOptions
  ): void
  batchRemoveEventListener(type: IAny, listener: IAny, options: IAny) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.engine as any)[DRIVER_INSTANCES_SYMBOL] = (this.engine as any)[DRIVER_INSTANCES_SYMBOL] || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.engine as any)[DRIVER_INSTANCES_SYMBOL].forEach((driver: IAny) => {
      // 确保driver上有eventTarget方法
      if (typeof driver.eventTarget === 'function') {
        const target = driver.eventTarget(type) as EventTarget & SymbolKeyed;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[EVENTS_BATCH_SYMBOL] = (target as any)[EVENTS_BATCH_SYMBOL] || {};
        target.removeEventListener(type, listener, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (target as any)[EVENTS_BATCH_SYMBOL][type];
      }
    });
  }
}
/**
 * 事件引擎
 */
export class Event extends Subscribable<ICustomEvent<IAny>> {
  private drivers: IEventDriverClass<IAny>[] = [];
  private containers: EventContainer[] = [];
  constructor(props?: IEventProps) {
    super();
    if (props?.drivers) {
      this.drivers = props.drivers;
    }
    if (props?.effects) {
      props.effects.forEach((effect) => {
        effect(this);
      });
    }
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: ISubscriber<InstanceType<T>>,
  ) {
    return this.subscribe((event) => {
      if (type && event instanceof type) {
        return subscriber(event);
      }
    });
  }

  subscribeWith<T extends ICustomEvent = ICustomEvent>(
    type: string | string[],
    subscriber: ISubscriber<T>,
  ) {
    return this.subscribe((event) => {
      if (isArr(type)) {
        if (type.includes(event?.type)) {
          return subscriber(event);
        }
      } else {
        if (type && event?.type === type) {
          return subscriber(event);
        }
      }
    });
  }

  attachEvents(
    container: EventContainer,
    contentWindow: Window = globalThisPolyfill,
    context?: IAny,
  ): void {
    if (!container) return;
    if (isWindow(container)) {
      return this.attachEvents(container.document, container, context);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((container as any)[ATTACHED_SYMBOL]) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    (container as any)[ATTACHED_SYMBOL] = this.drivers.map((EventDriver) => {
      const driver = new EventDriver(this, context);
      driver.contentWindow = contentWindow;
      driver.container = container;
      driver.attach(container);
      return driver;
    });
    if (!this.containers.includes(container)) {
      this.containers.push(container);
    }
  }

  detachEvents(container?: EventContainer): void {
    if (!container) {
      this.containers.forEach((container) => {
        this.detachEvents(container);
      });
      return;
    }
    if (isWindow(container)) {
      return this.detachEvents(container.document);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(container as any)[ATTACHED_SYMBOL]) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container as any)[ATTACHED_SYMBOL].forEach((driver: IEventDriver) => {
      driver.detach(container);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[DRIVER_INSTANCES_SYMBOL] = (this as any)[DRIVER_INSTANCES_SYMBOL] || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[DRIVER_INSTANCES_SYMBOL] = (this as any)[DRIVER_INSTANCES_SYMBOL].reduce(
      (drivers: IEventDriver[], driver: IEventDriver) => {
        if (driver.container === container) {
          driver.detach(container);
          return drivers;
        }
        return drivers.concat(driver);
      },
      [],
    );
    this.containers = this.containers.filter(item => item !== container);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    delete (container as any)[ATTACHED_SYMBOL];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    delete (container as any)[EVENTS_SYMBOL];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    delete (container as any)[EVENTS_ONCE_SYMBOL];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    delete (container as any)[EVENTS_BATCH_SYMBOL];
  }
}
