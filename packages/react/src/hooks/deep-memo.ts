import { addWithLimit } from '@yimoka/shared';
import { isEqual } from 'lodash-es';
import { DependencyList, useMemo, useRef } from 'react';


export const useDeepMemo: typeof useMemo = (factory, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);
  if (deps === undefined || deps === null || !isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current = addWithLimit(signalRef.current);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, [signalRef.current]);
};
