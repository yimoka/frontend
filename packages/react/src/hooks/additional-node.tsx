import { RecursionField, useFieldSchema } from '@formily/react';
import { isVacuous } from '@yimoka/shared';
import React, { ReactNode, useMemo } from 'react';

export const useAdditionalNode: <T = ReactNode> (propName: string, node?: T) => T | ReactNode = (propName, node) => {
  const { name, 'x-additional-schema': additional } = useFieldSchema() ?? {};
  const schema = additional?.[propName];

  return useMemo(() => {
    // null 有意义
    if (node !== undefined || isVacuous(schema)) {
      return node;
    }
    return <RecursionField onlyRenderProperties name={name} schema={{ type: 'void', properties: { [propName]: schema } }} />;
  }, [node, schema, name, propName]);
};
