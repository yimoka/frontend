import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent';

export class PrependNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent {
  type = 'prepend:node';
}
