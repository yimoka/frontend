import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';

export class RemoveWorkspaceEvent
  extends AbstractWorkspaceEvent
  implements ICustomEvent {
  type = 'remove:workspace';
}
