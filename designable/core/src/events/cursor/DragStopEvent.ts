import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
  type = 'drag:stop';
}
