import { IAny } from '@yimoka/shared';

import { IEngineContext } from '../../types';

export class AbstractHistoryEvent {
  data: IAny;
  context: IEngineContext;
  constructor(data: IAny) {
    this.data = data;
  }
}
