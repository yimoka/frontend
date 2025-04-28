import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class InsertChildrenEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'insert:children';
}
