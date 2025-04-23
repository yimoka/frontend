import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class RemoveNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'remove:node';
}
