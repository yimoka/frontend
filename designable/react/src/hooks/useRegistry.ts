import { GlobalRegistry, IDesignerRegistry } from '@designable/core';
import { globalThisPolyfill } from '@designable/shared';

export const useRegistry = (): IDesignerRegistry => globalThisPolyfill.__DESIGNER_REGISTRY__ || GlobalRegistry;
