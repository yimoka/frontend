import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertAfterEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'insert:after';
}
