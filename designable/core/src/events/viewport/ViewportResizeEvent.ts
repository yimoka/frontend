import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractViewportEvent } from './AbstractViewportEvent';

export class ViewportResizeEvent
  extends AbstractViewportEvent
  implements ICustomEvent {
  type = 'viewport:resize';
}
