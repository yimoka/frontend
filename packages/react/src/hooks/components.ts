import { useExpressionScope } from '@formily/react';
import { useMemo } from 'react';

import { useConfigComponents } from '../context/config';

export const useScopeComponents = () => {
  const scope = useExpressionScope();
  return useMemo(() => scope?.components ?? {}, [scope]);
};

export const useComponents = () => {
  const configComponents = useConfigComponents();
  const scopeComponents = useScopeComponents();
  return useMemo(() => ({ ...configComponents, ...scopeComponents }), [configComponents, scopeComponents]);
};


