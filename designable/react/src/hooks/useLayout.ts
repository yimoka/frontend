import { globalThisPolyfill } from '@designable/shared';
import { useContext } from 'react';

import { DesignerLayoutContext } from '../context';
import { IDesignerLayoutContext } from '../types';

export const useLayout = (): IDesignerLayoutContext => (
  globalThisPolyfill.__DESIGNABLE_LAYOUT__
    || useContext(DesignerLayoutContext)
);
