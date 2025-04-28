import { ICustomEvent } from '@yimoka/designable-shared';

import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';

export class SwitchWorkspaceEvent
  extends AbstractWorkspaceEvent
  implements ICustomEvent {
  type = 'switch:workspace';
}
