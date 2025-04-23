import { IAny } from '@yimoka/shared';

import { globalThisPolyfill } from './globalThisPolyfill';
import { Subscribable, ISubscriber } from './subscribable';
import { isArr, isWindow } from './types';

const ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL');
const EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__');
const EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL');
const EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL');
const DRIVER_INSTANCES_SYMBOL = Symbol('DRIVER_INSTANCES_SYMBOL');

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

  context: Context;

  constructor(engine: Engine, context?: Context) {
    this.engine = engine;
    this.context = context;
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

  attach(container: EventDriverContainer) {
    console.error('attach must implement.');
  }

  detach(container: EventDriverContainer) {
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
    const target = this.eventTarget(type);
    if (isOnlyMode(options?.mode)) {
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
      const { constructor } = this;
      constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
      const handler = target[EVENTS_ONCE_SYMBOL][type];
      const container = constructor[EVENTS_ONCE_SYMBOL][type];
      if (!handler) {
        if (container) {
          if (options.mode === 'onlyChild') {
            if (container.contains(target)) {
              container.removeEventListener(
                type,
                container[EVENTS_ONCE_SYMBOL][type],
                options,
              );
              delete container[EVENTS_ONCE_SYMBOL][type];
            }
          } else if (options.mode === 'onlyParent') {
            if (container.contains(target)) return;
          }
        }
        target.addEventListener(type, listener, options);
        target[EVENTS_ONCE_SYMBOL][type] = listener;
        constructor[EVENTS_ONCE_SYMBOL][type] = target;
      }
    } else {
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
      if (!target[EVENTS_SYMBOL][type]?.get?.(listener)) {
        target.addEventListener(type, listener, options);
        target[EVENTS_SYMBOL][type]?.set?.(listener, true);
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
    const target = this.eventTarget(type);
    if (isOnlyMode(options?.mode)) {
      const { constructor } = this;
      constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
      target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
      delete constructor[EVENTS_ONCE_SYMBOL][type];
      delete target[EVENTS_ONCE_SYMBOL][type];
      target.removeEventListener(type, listener, options);
    } else {
      target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
      target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
      target[EVENTS_SYMBOL][type]?.delete?.(listener);
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
    this.engine[DRIVER_INSTANCES_SYMBOL] = this.engine[DRIVER_INSTANCES_SYMBOL] || [];
    if (!this.engine[DRIVER_INSTANCES_SYMBOL].includes(this)) {
      this.engine[DRIVER_INSTANCES_SYMBOL].push(this);
    }
    this.engine[DRIVER_INSTANCES_SYMBOL].forEach((driver) => {
      const target = driver.eventTarget(type);
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
      if (!target[EVENTS_BATCH_SYMBOL][type]) {
        target.addEventListener(type, listener, options);
        target[EVENTS_BATCH_SYMBOL][type] = listener;
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
    this.engine[DRIVER_INSTANCES_SYMBOL] = this.engine[DRIVER_INSTANCES_SYMBOL] || [];
    this.engine[DRIVER_INSTANCES_SYMBOL].forEach((driver) => {
      const target = driver.eventTarget(type);
      target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
      target.removeEventListener(type, listener, options);
      delete target[EVENTS_BATCH_SYMBOL][type];
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
  ) {
    if (!container) return;
    if (isWindow(container)) {
      return this.attachEvents(container.document, container, context);
    }
    if (container[ATTACHED_SYMBOL]) return;
    container[ATTACHED_SYMBOL] = this.drivers.map((EventDriver) => {
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

  detachEvents(container?: EventContainer) {
    if (!container) {
      this.containers.forEach((container) => {
        this.detachEvents(container);
      });
      return;
    }
    if (isWindow(container)) {
      return this.detachEvents(container.document);
    }
    if (!container[ATTACHED_SYMBOL]) return;
    container[ATTACHED_SYMBOL].forEach((driver) => {
      driver.detach(container);
    });

    this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL] || [];
    this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL].reduce(
      (drivers, driver) => {
        if (driver.container === container) {
          driver.detach(container);
          return drivers;
        }
        return drivers.concat(driver);
      },
      [],
    );
    this.containers = this.containers.filter(item => item !== container);
    delete container[ATTACHED_SYMBOL];
    delete container[EVENTS_SYMBOL];
    delete container[EVENTS_ONCE_SYMBOL];
    delete container[EVENTS_BATCH_SYMBOL];
  }
}
