import { untracked } from '@formily/reactive';
import { isArr } from '@yimoka/designable-shared';

import { IAny } from '@yimoka/shared';

import { mergeLocales } from './internals';
import { Engine, TreeNode } from './models';
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets';
import {
  IEngineProps,
  IResourceCreator,
  IBehaviorCreator,
  IDesignerLocales,
  IResource,
  IBehavior,
  IBehaviorHost,
  IResourceHost,
} from './types';

export const isBehaviorHost = (val: IAny): val is IBehaviorHost => val?.Behavior && isBehaviorList(val.Behavior);

export const isBehaviorList = (val: IAny): val is IBehavior[] => Array.isArray(val) && val.every(isBehavior);

export const isBehavior = (val: IAny): val is IBehavior => val?.name
  || val?.selector
  || val?.extends
  || val?.designerProps
  || val?.designerLocales;

export const isResourceHost = (val: IAny): val is IResourceHost => val?.Resource && isResourceList(val.Resource);

export const isResourceList = (val: IAny): val is IResource[] => Array.isArray(val) && val.every(isResource);

export const isResource = (val: IAny): val is IResource => val?.node && !!val.node.isSourceNode && val.node instanceof TreeNode;

export const createLocales = (...packages: IDesignerLocales[]) => {
  const results = {};
  packages.forEach((locales) => {
    mergeLocales(results, locales);
  });
  return results;
};

export const createBehavior = (...behaviors: Array<IBehaviorCreator | IBehaviorCreator[]>): IBehavior[] => behaviors.reduce((buf: IBehavior[], behavior) => {
  if (isArr(behavior)) return buf.concat(createBehavior(...behavior));
  const { selector } = behavior || {};
  if (!selector) return buf;
  if (typeof selector === 'string') {
    behavior.selector = node => node.componentName === selector;
  }
  return buf.concat(behavior as IBehavior);
}, []);

export const createResource = (...sources: IResourceCreator[]): IResource[] => sources.reduce<IResource[]>((buf, source) => [
  ...buf,
  {
    ...source,
    node: new TreeNode({
      componentName: '$$ResourceNode$$',
      isSourceNode: true,
      children: source.elements || [],
    }),
  },
], []);

export const createDesigner = (props: IEngineProps<Engine> = {}) => {
  const drivers = props.drivers || [];
  const effects = props.effects || [];
  const shortcuts = props.shortcuts || [];
  return untracked(() => new Engine({
    ...props,
    effects: [...effects, ...DEFAULT_EFFECTS],
    drivers: [...drivers, ...DEFAULT_DRIVERS],
    shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
  }));
};
