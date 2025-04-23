import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractCursorEvent } from './AbstractCursorEvent';

export class DragMoveEvent extends AbstractCursorEvent implements ICustomEvent {
  type = 'drag:move';
}
