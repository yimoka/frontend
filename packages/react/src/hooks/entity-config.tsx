import { useExpressionScope } from '@formily/react';
import { IEntityConfig } from '@yimoka/store';
import { useMemo } from 'react';

export const useEntityConfig = (config?: IEntityConfig | false) => {
  const scope = useExpressionScope();
  return useMemo(() => (config === false ? undefined : (config ?? (scope?.$config as IEntityConfig))), [config, scope]);
};

