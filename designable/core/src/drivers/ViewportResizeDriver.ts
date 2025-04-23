import { ResizeObserver } from '@juggle/resize-observer';
import { EventDriver, globalThisPolyfill } from '@yimoka/designable-shared';


import { ViewportResizeEvent } from '../events';
import { Engine } from '../models/Engine';

export class ViewportResizeDriver extends EventDriver<Engine> {
  request: number | null = null;

  resizeObserver: ResizeObserver | null = null;

  onResize = (e: Event | ResizeObserverEntry[]) => {
    if ((e as Event).preventDefault) (e as Event).preventDefault();
    const requestId = requestAnimationFrame(() => {
      if (this.request !== null) {
        cancelAnimationFrame(this.request);
      }
      this.dispatch(new ViewportResizeEvent({
        scrollX: this.contentWindow.scrollX,
        scrollY: this.contentWindow.scrollY,
        width: this.contentWindow.innerWidth,
        height: this.contentWindow.innerHeight,
        innerHeight: this.contentWindow.innerHeight,
        innerWidth: this.contentWindow.innerWidth,
        view: this.contentWindow,
        target: (e as Event).target || this.container,
      }));
    });
    this.request = requestId;
  };

  attach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.addEventListener('resize', this.onResize);
    } else {
      if (this.container && this.container !== document) {
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(this.container as HTMLElement);
      }
    }
  }

  detach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.removeEventListener('resize', this.onResize);
    } else if (this.resizeObserver) {
      if (this.container && this.container !== document) {
        this.resizeObserver.unobserve(this.container as HTMLElement);
        this.resizeObserver.disconnect();
      }
    }
  }
}
