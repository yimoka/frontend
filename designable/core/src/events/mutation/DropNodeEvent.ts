import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class DropNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'drop:node';
}
