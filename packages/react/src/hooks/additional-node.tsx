import { RecursionField, useFieldSchema } from '@formily/react';
import { isBlank } from '@yimoka/shared';
import React, { ReactNode, useMemo } from 'react';

export const useAdditionalNode: <T = ReactNode> (propName: string, node?: T) => T | ReactNode = (propName, node) => {
  const { name, 'x-additional-schema': additional } = useFieldSchema() ?? {};
  const schema = additional?.[propName];

  return useMemo(() => {
    if (node !== undefined || isBlank(schema)) {
      return node;
    }
    return <RecursionField name={name} onlyRenderProperties schema={{ type: 'void', properties: { [propName]: schema } }} />;
  }, [node, schema, name, propName]);
};
